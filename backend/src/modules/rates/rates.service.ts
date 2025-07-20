import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
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

  // Cron job: cada minuto + 10s
  @Cron(CronExpression.EVERY_MINUTE, { name: 'fetchRate' })
  async fetchRate() {
    try {
      await new Promise(res => setTimeout(res, 10000)); // delay de 10s
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
} 
    return { history };
  }
} 
    return { history };
  }
} 
    return { history };
  }
} 