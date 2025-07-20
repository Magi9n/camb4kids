import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from '../modules/auth/entities/user.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { ExchangeRate } from '../modules/rates/entities/exchange-rate.entity';
import { AdminSetting } from '../modules/admin/entities/admin-setting.entity';

// Cargar .env desde el directorio padre (public_html)
config({ path: join(__dirname, '../../../.env') });

export const typeOrmConfig = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'cambio_mate4kids',
  entities: [User, Order, ExchangeRate, AdminSetting],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export default new DataSource({
  ...typeOrmConfig,
  type: 'mysql',
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
}); 