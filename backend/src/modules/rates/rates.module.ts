import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { RatesGateway } from './rates.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  providers: [RatesService, RatesGateway],
  controllers: [RatesController],
  exports: [RatesService, RatesGateway],
})
export class RatesModule {} 