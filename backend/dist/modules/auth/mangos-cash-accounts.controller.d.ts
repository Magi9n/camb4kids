import { MangosCashAccountsService } from './mangos-cash-accounts.service';
export declare class MangosCashAccountsController {
    private readonly mangosCashAccountsService;
    private readonly logger;
    constructor(mangosCashAccountsService: MangosCashAccountsService);
    findByBankAndCurrency(bank: string, currency: string): Promise<import("./mangos-cash-account.entity").MangosCashAccount>;
    findAll(): Promise<import("./mangos-cash-account.entity").MangosCashAccount[]>;
}
