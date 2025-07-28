import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto/bank-account.dto';
export declare class BankAccountsController {
    private readonly bankAccountsService;
    constructor(bankAccountsService: BankAccountsService);
    create(createBankAccountDto: CreateBankAccountDto, req: any): Promise<import("./entities/bank-account.entity").BankAccount>;
    findAll(req: any): Promise<import("./entities/bank-account.entity").BankAccount[]>;
    findOne(id: string, req: any): Promise<import("./entities/bank-account.entity").BankAccount>;
    update(id: string, updateBankAccountDto: UpdateBankAccountDto, req: any): Promise<import("./entities/bank-account.entity").BankAccount>;
    remove(id: string, req: any): Promise<void>;
}
