import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesService } from './rates.service';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  controllers: [],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {} 