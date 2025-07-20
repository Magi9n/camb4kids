import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare const typeOrmConfig: (configService: ConfigService) => DataSourceOptions;
declare const _default: DataSource;
export default _default;
