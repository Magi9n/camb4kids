import { Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ConfigService } from '@nestjs/config';
export declare class RatesService {
    private readonly rateRepo;
    private readonly configService;
    private readonly logger;
    private readonly redis;
    constructor(rateRepo: Repository<ExchangeRate>, configService: ConfigService);
    fetchRate(): Promise<void>;
    getCurrent(): Promise<{
        rate: number;
    }>;
    getHistory(from: string, to: string): Promise<{
        history: ExchangeRate[];
    }>;
    getHourly(): Promise<{
        time: string;
        value: number;
    }[]>;
}
