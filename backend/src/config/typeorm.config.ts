import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/auth/entities/user.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { ExchangeRate } from '../modules/rates/entities/exchange-rate.entity';
import { AdminSetting } from '../modules/admin/entities/admin-setting.entity';

export const typeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User, Order, ExchangeRate, AdminSetting],
  // migrations: ['src/migrations/*.ts'], // Comentado temporalmente
  migrationsRun: false,
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
});

// Para migraciones, usar configuración por defecto
const configService = new ConfigService();
export default new DataSource(typeOrmConfig(configService)); 
// Para migraciones, usar configuración por defecto
const configService = new ConfigService();
export default new DataSource(typeOrmConfig(configService)); 
// Para migraciones, usar configuración por defecto
const configService = new ConfigService();
export default new DataSource(typeOrmConfig(configService)); 
// Para migraciones, usar configuración por defecto
const configService = new ConfigService();
export default new DataSource(typeOrmConfig(configService)); 