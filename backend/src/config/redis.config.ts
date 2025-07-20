import { config } from 'dotenv';
import { join } from 'path';

// Cargar .env desde el directorio padre (public_html)
config({ path: join(__dirname, '../../../.env') });

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
}; 