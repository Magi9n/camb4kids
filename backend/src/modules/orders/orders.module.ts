import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { RatesModule } from '../rates/rates.module';
import { CacheModule } from '../../common/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), RatesModule, CacheModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {} 