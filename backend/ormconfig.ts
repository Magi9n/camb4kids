import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { typeOrmConfig } from './src/config/typeorm.config';

config();

export default new DataSource(typeOrmConfig); 