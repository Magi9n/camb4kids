import { DataSource } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { ExchangeRate } from '../modules/rates/entities/exchange-rate.entity';
import { AdminSetting } from '../modules/admin/entities/admin-setting.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Order, ExchangeRate, AdminSetting],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 