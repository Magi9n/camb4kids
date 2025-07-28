import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Redis from 'ioredis';

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);
  private readonly redis: Redis;

  constructor(
    @InjectRepository(ExchangeRate)
    private readonly rateRepo: Repository<ExchangeRate>,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({ 
      host: this.configService.get('REDIS_HOST') || 'localhost', 
      port: parseInt(this.configService.get('REDIS_PORT')) || 6379 
    });
  }

  // Cron job: cada 1 minuto y 48 segundos
  @Cron('48 */1 * * * *', { name: 'fetchRate' })
  async fetchRate() {
    try {
      // No delay necesario
      const url = `${this.configService.get('TWELVEDATA_API_URL')}&apikey=${this.configService.get('TWELVEDATA_API_KEY')}`;
      const { data } = await axios.get(url);
      const rate = parseFloat(data.price);
      if (!rate) throw new Error('No se pudo obtener la tasa');
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
      this.logger.log(`Tasa actualizada: ${rate}`);
    } catch (e) {
      this.logger.error('Error al actualizar tasa', e);
    }
  }

  async getCurrent() {
    let rate = await this.redis.get('EXCHANGE_RATE_USD_PEN');
    if (!rate) {
      const last = await this.rateRepo.find({ order: { createdAt: 'DESC' }, take: 1 });
      rate = last[0]?.rate?.toString() || null;
    }
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
} 