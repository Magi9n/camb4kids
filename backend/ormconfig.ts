import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { typeOrmConfig } from './src/config/typeorm.config';

// Cargar .env desde el directorio padre (public_html)
config({ path: join(__dirname, '../.env') });

export default new DataSource(typeOrmConfig); 