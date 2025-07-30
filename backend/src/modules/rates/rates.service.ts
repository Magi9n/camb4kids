import { Injectable, Logger, Inject, forwardRef, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Redis from 'ioredis';
import { RatesGateway } from './rates.gateway';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);
  private readonly redis: Redis;
  private currentApiKeyIndex = 0;

  constructor(
    @InjectRepository(ExchangeRate)
    private readonly rateRepo: Repository<ExchangeRate>,
    private readonly configService: ConfigService,
    @Optional() @Inject(forwardRef(() => RatesGateway))
    private ratesGateway?: RatesGateway,
  ) {
    this.redis = new Redis({ 
      host: this.configService.get('REDIS_HOST') || 'localhost', 
      port: parseInt(this.configService.get('REDIS_PORT')) || 6379 
    });
  }

  private getApiKeys(): string[] {
    return [
      this.configService.get('TWELVEDATA_API_KEY'),
      this.configService.get('TWELVEDATA_API_KEY_2'),
      this.configService.get('TWELVEDATA_API_KEY_3'),
    ].filter(key => key); // Filtrar keys vacíos
  }

  private async fetchRateWithApiKey(apiKey: string): Promise<number> {
    const url = `${this.configService.get('TWELVEDATA_API_URL')}&apikey=${apiKey}`;
    const { data } = await axios.get(url);
    const rate = parseFloat(data.price);
    if (!rate) throw new Error('No se pudo obtener la tasa');
    return rate;
  }

  private async tryFetchRate(): Promise<number> {
    const apiKeys = this.getApiKeys();
    if (apiKeys.length === 0) {
      throw new Error('No hay API keys configuradas');
    }

    let lastError: Error | null = null;
    
    // Intentar con el API key actual
    for (let attempt = 0; attempt < apiKeys.length; attempt++) {
      const apiKeyIndex = (this.currentApiKeyIndex + attempt) % apiKeys.length;
      const apiKey = apiKeys[apiKeyIndex];
      
      try {
        const rate = await this.fetchRateWithApiKey(apiKey);
        // Si funciona, actualizar el índice actual
        this.currentApiKeyIndex = apiKeyIndex;
        this.logger.log(`Tasa obtenida exitosamente con API key ${apiKeyIndex + 1}: ${rate}`);
        return rate;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Error con API key ${apiKeyIndex + 1}: ${error.message}`);
        continue;
      }
    }
    
    // Si llegamos aquí, todos los API keys fallaron
    throw lastError || new Error('Todos los API keys fallaron');
  }

  // Intervalo personalizado: cada 1 minuto y 48 segundos (108 segundos)
  async fetchRate() {
    try {
      const rate = await this.tryFetchRate();
      
      const exRate = this.rateRepo.create({
        fromCurrency: 'USD',
        toCurrency: 'PEN',
        rate,
      });
      await this.rateRepo.save(exRate);
      
      // Eliminar el tipo de cambio más antiguo si hay más de 1
      const allRates = await this.rateRepo.find({ order: { createdAt: 'ASC' } });
      if (allRates.length > 1) {
        const oldest = allRates[0];
        await this.rateRepo.delete(oldest.id);
      }
      
      await this.redis.set('EXCHANGE_RATE_USD_PEN', rate, 'EX', 70);
      // Emitir por WebSocket si existe el gateway
      if (this.ratesGateway) {
        this.ratesGateway.emitRateUpdate(rate);
      }
      this.logger.log(`Tasa actualizada: ${rate}`);
    } catch (e) {
      this.logger.error('Error al actualizar tasa', e);
    }
  }

  // Método para iniciar el intervalo personalizado
  onModuleInit() {
    // Ejecutar inmediatamente
    this.fetchRate();
    
    // Configurar intervalo de 1 minuto y 48 segundos (108000 ms)
    setInterval(() => {
      this.fetchRate();
    }, 108000);
  }

  async getCurrent() {
    // Eliminar cache: siempre consultar la base de datos
    const last = await this.rateRepo.find({ order: { createdAt: 'DESC' }, take: 1 });
    const rate = last[0]?.rate?.toString() || null;
    return { rate: rate ? parseFloat(rate) : null };
  }

  async getHistory(from: string, to: string) {
    const history = await this.rateRepo.find({
      where: {
        createdAt: Between(new Date(from), new Date(to)),
      },
      order: { createdAt: 'ASC' },
    });
    return { history };
  }

  async getHourly() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const history = await this.rateRepo.find({
      where: { createdAt: Between(oneHourAgo, now) },
      order: { createdAt: 'ASC' },
    });
    return history.map(r => ({
      time: r.createdAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(Number(r.rate).toFixed(3)),
    }));
  }

  async getDailyAverages() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Obtener todos los datos del día actual
    const todayRates = await this.rateRepo.find({
      where: { 
        createdAt: Between(today, tomorrow) 
      },
      order: { createdAt: 'ASC' },
    });

    if (todayRates.length === 0) {
      return [];
    }

    // Agrupar por intervalos de 10 minutos
    const intervals = [];
    const intervalMinutes = 10;
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const startTime = new Date(today);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + intervalMinutes);
        
        // Filtrar datos que caen en este intervalo
        const intervalData = todayRates.filter(rate => 
          rate.createdAt >= startTime && rate.createdAt < endTime
        );
        
        if (intervalData.length > 0) {
          // Calcular promedio del intervalo
          const totalRate = intervalData.reduce((sum, rate) => sum + parseFloat(rate.rate.toString()), 0);
          const averageRate = totalRate / intervalData.length;
          
          intervals.push({
            time: startTime.toLocaleTimeString('es-PE', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: parseFloat(averageRate.toFixed(3)),
          });
        }
      }
    }

    return intervals;
  }
} 