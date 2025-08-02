import { Repository } from 'typeorm';
import { MangosCashAccount } from './mangos-cash-account.entity';
export declare class MangosCashAccountsService {
    private mangosCashAccountRepository;
    private readonly logger;
    constructor(mangosCashAccountRepository: Repository<MangosCashAccount>);
    findByBankAndCurrency(bank: string, currency: string): Promise<MangosCashAccount>;
    findAll(): Promise<MangosCashAccount[]>;
    create(accountData: Partial<MangosCashAccount>): Promise<MangosCashAccount>;
    update(id: number, accountData: Partial<MangosCashAccount>): Promise<MangosCashAccount>;
    delete(id: number): Promise<void>;
}
