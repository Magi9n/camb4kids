import { RatesService } from './rates.service';
export declare class RatesController {
    private readonly ratesService;
    constructor(ratesService: RatesService);
    getCurrent(): Promise<{
        rate: number;
    }>;
    getHistory(from: string, to: string): Promise<{
        history: import("./entities/exchange-rate.entity").ExchangeRate[];
    }>;
}
