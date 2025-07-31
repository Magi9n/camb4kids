import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangosCashAccount } from './mangos-cash-account.entity';

@Injectable()
export class MangosCashAccountsService {
  private readonly logger = new Logger(MangosCashAccountsService.name);
  
  constructor(
    @InjectRepository(MangosCashAccount)
    private mangosCashAccountRepository: Repository<MangosCashAccount>,
  ) {}

  async findByBankAndCurrency(bank: string, currency: string): Promise<MangosCashAccount> {
    try {
      this.logger.log(`Buscando cuenta en servicio para banco: ${bank}, moneda: ${currency}`);
      
      const account = await this.mangosCashAccountRepository.findOne({
        where: {
          bank,
          currency,
          isActive: true
        }
      });
      
      if (account) {
        this.logger.log(`Cuenta encontrada en BD: ${JSON.stringify(account)}`);
      } else {
        this.logger.warn(`No se encontró cuenta en BD para banco: ${bank}, moneda: ${currency}`);
      }
      
      return account;
    } catch (error) {
      this.logger.error(`Error en servicio al buscar cuenta: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  async findAll(): Promise<MangosCashAccount[]> {
    try {
      this.logger.log('Obteniendo todas las cuentas de MangosCash desde BD');
      const accounts = await this.mangosCashAccountRepository.find({
        where: { isActive: true },
        order: { bank: 'ASC', currency: 'ASC' }
      });
      this.logger.log(`Se encontraron ${accounts.length} cuentas activas en BD`);
      return accounts;
    } catch (error) {
      this.logger.error(`Error en servicio al obtener todas las cuentas: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
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