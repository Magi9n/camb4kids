import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    // Aquí se importarán los módulos: AuthModule, RatesModule, OrdersModule, AdminModule
  ],
})
export class AppModule {} 