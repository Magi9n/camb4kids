import { RatesService } from './rates.service';
export declare class RatesController {
    private readonly ratesService;
    constructor(ratesService: RatesService);
    getCurrent(req: any): Promise<{
        rate: number;
    }>;
    getHistory(from: string, to: string): Promise<{
        history: import("./entities/exchange-rate.entity").ExchangeRate[];
    }>;
    getHourly(): Promise<{
        time: string;
        value: number;
    }[]>;
    getDailyAverages(): Promise<any[]>;
}
