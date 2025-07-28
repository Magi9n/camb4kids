import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto/bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepo: Repository<BankAccount>,
  ) {}

  async create(createBankAccountDto: CreateBankAccountDto, userId: number): Promise<BankAccount> {
    const bankAccount = this.bankAccountRepo.create({
      ...createBankAccountDto,
      userId,
    });
    return await this.bankAccountRepo.save(bankAccount);
  }

  async findAllByUser(userId: number): Promise<BankAccount[]> {
    return await this.bankAccountRepo.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepo.findOne({
      where: { id, userId, isActive: true },
    });
    
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }
    
    return bankAccount;
  }

  async update(id: number, updateBankAccountDto: UpdateBankAccountDto, userId: number): Promise<BankAccount> {
    const bankAccount = await this.findOne(id, userId);
    
    Object.assign(bankAccount, updateBankAccountDto);
    return await this.bankAccountRepo.save(bankAccount);
  }

  async remove(id: number, userId: number): Promise<void> {
    const bankAccount = await this.findOne(id, userId);
    bankAccount.isActive = false;
    await this.bankAccountRepo.save(bankAccount);
  }
} 