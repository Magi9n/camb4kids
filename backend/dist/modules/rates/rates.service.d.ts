import { Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ConfigService } from '@nestjs/config';
export declare class RatesService {
    private readonly rateRepo;
    private readonly configService;
    private readonly logger;
    private readonly redis;
    private currentApiKeyIndex;
    constructor(rateRepo: Repository<ExchangeRate>, configService: ConfigService);
    private getApiKeys;
    private fetchRateWithApiKey;
    private tryFetchRate;
    fetchRate(): Promise<void>;
    onModuleInit(): void;
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
    getDailyAverages(): Promise<any[]>;
}
