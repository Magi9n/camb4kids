import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import dataSource from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { RatesModule } from './modules/rates/rates.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AdminModule } from './modules/admin/admin.module';
import { CacheModule } from './common/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSource.options),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    CacheModule,
    AuthModule,
    RatesModule,
    OrdersModule,
    AdminModule,
  ],
})
export class AppModule {} 