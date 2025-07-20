import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import Redis from 'ioredis';

const redis = new Redis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) });

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(
    @InjectRepository(ExchangeRate)
    private readonly rateRepo: Repository<ExchangeRate>,
  ) {}

  // Cron job: cada minuto + 10s
  @Cron(CronExpression.EVERY_MINUTE, { name: 'fetchRate' })
  async fetchRate() {
    try {
      await new Promise(res => setTimeout(res, 10000)); // delay de 10s
      const url = `${process.env.TWELVEDATA_API_URL}&apikey=${process.env.TWELVEDATA_API_KEY}`;
      const { data } = await axios.get(url);
      const rate = parseFloat(data.price);
      if (!rate) throw new Error('No se pudo obtener la tasa');
      const exRate = this.rateRepo.create({
        fromCurrency: 'USD',
        toCurrency: 'PEN',
        rate,
      });
      await this.rateRepo.save(exRate);
      await redis.set('EXCHANGE_RATE_USD_PEN', rate, 'EX', 70);
      this.logger.log(`Tasa actualizada: ${rate}`);
    } catch (e) {
      this.logger.error('Error al actualizar tasa', e);
    }
  }

  async getCurrent() {
    let rate = await redis.get('EXCHANGE_RATE_USD_PEN');
    if (!rate) {
      const last = await this.rateRepo.find({ order: { createdAt: 'DESC' }, take: 1 });
      rate = last[0]?.rate || null;
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