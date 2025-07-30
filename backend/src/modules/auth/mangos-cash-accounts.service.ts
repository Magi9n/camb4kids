import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangosCashAccount } from './mangos-cash-account.entity';

@Injectable()
export class MangosCashAccountsService {
  constructor(
    @InjectRepository(MangosCashAccount)
    private mangosCashAccountRepository: Repository<MangosCashAccount>,
  ) {}

  async findByBankAndCurrency(bank: string, currency: string): Promise<MangosCashAccount> {
    return this.mangosCashAccountRepository.findOne({
      where: {
        bank,
        currency,
        isActive: true
      }
    });
  }

  async findAll(): Promise<MangosCashAccount[]> {
    return this.mangosCashAccountRepository.find({
      where: { isActive: true },
      order: { bank: 'ASC', currency: 'ASC' }
    });
  }

  async create(accountData: Partial<MangosCashAccount>): Promise<MangosCashAccount> {
    const account = this.mangosCashAccountRepository.create(accountData);
    return this.mangosCashAccountRepository.save(account);
  }

  async update(id: number, accountData: Partial<MangosCashAccount>): Promise<MangosCashAccount> {
    await this.mangosCashAccountRepository.update(id, accountData);
    return this.mangosCashAccountRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.mangosCashAccountRepository.delete(id);
  }
} 