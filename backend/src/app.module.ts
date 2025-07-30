import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { RatesModule } from './modules/rates/rates.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { User } from './modules/auth/entities/user.entity';
import { PasswordReset } from './modules/auth/entities/password-reset.entity';
import { EmailChange } from './modules/auth/entities/email-change.entity';
import { BankAccount } from './modules/auth/entities/bank-account.entity';
import { MangosCashAccount } from './modules/auth/mangos-cash-account.entity';
import { Operation } from './modules/auth/operation.entity';
import { ExchangeRate } from './modules/rates/entities/exchange-rate.entity';
import { Alert } from './modules/alerts/alert.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User, 
        PasswordReset, 
        EmailChange, 
        BankAccount,
        MangosCashAccount,
        Operation,
        ExchangeRate, 
        Alert
      ],
      synchronize: false,
      logging: false,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    RatesModule,
    AlertsModule,
  ],
})
export class AppModule {} 