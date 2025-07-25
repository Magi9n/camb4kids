import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { ExchangeRate } from '../modules/rates/entities/exchange-rate.entity';
import { AdminSetting } from '../modules/admin/entities/admin-setting.entity';
import { Alert } from '../modules/alerts/alert.entity';

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('Entities glob:', [__dirname + '/../modules/**/*.entity.js']);
console.log('Migrations glob:', [__dirname + '/../migrations/*.js']);

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../modules/**/*.entity.js'],
  migrations: [__dirname + '/../migrations/*.js'],
  migrationsRun: false,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 