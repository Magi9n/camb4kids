import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { RatesModule } from './modules/rates/rates.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AdminModule } from './modules/admin/admin.module';
import { CacheModule } from './common/cache.module';
import { User } from './modules/auth/entities/user.entity';
import { Order } from './modules/orders/entities/order.entity';
import { ExchangeRate } from './modules/rates/entities/exchange-rate.entity';
import { AdminSetting } from './modules/admin/entities/admin-setting.entity';
import { AlertsModule } from './modules/alerts/alerts.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { Subscription } from './modules/subscriptions/subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT', '3306')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [User, Order, ExchangeRate, AdminSetting, Subscription],
        migrations: [
          config.get('NODE_ENV') === 'development'
            ? 'src/migrations/*.ts'
            : 'dist/migrations/*.js'
        ],
        migrationsRun: false,
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    CacheModule,
    AuthModule,
    RatesModule,
    OrdersModule,
    AdminModule,
    AlertsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {} 