import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from '../modules/auth/entities/user.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { ExchangeRate } from '../modules/rates/entities/exchange-rate.entity';
import { AdminSetting } from '../modules/admin/entities/admin-setting.entity';

// Cargar .env desde el directorio padre (public_html)
config({ path: join(__dirname, '../../../.env') });

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Order, ExchangeRate, AdminSetting],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export default new DataSource(typeOrmConfig); 