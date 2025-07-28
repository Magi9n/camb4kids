import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto/bank-account.dto';
export declare class BankAccountsService {
    private readonly bankAccountRepo;
    constructor(bankAccountRepo: Repository<BankAccount>);
    create(createBankAccountDto: CreateBankAccountDto, userId: number): Promise<BankAccount>;
    findAllByUser(userId: number): Promise<BankAccount[]>;
    findOne(id: number, userId: number): Promise<BankAccount>;
    update(id: number, updateBankAccountDto: UpdateBankAccountDto, userId: number): Promise<BankAccount>;
    remove(id: number, userId: number): Promise<void>;
}
