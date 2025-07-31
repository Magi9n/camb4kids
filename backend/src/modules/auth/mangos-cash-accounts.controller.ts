import { Controller, Get, Param, UseGuards, Logger } from '@nestjs/common';
import { MangosCashAccountsService } from './mangos-cash-accounts.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin/mangos-cash-accounts')
@UseGuards(JwtAuthGuard)
export class MangosCashAccountsController {
  private readonly logger = new Logger(MangosCashAccountsController.name);
  
  constructor(private readonly mangosCashAccountsService: MangosCashAccountsService) {}

  @Get(':bank/:currency')
  async findByBankAndCurrency(
    @Param('bank') bank: string,
    @Param('currency') currency: string,
  ) {
    try {
      this.logger.log(`Buscando cuenta de MangosCash para banco: ${bank}, moneda: ${currency}`);
      
      const account = await this.mangosCashAccountsService.findByBankAndCurrency(bank, currency);
      
      if (!account) {
        this.logger.warn(`No se encontró cuenta de MangosCash para banco: ${bank}, moneda: ${currency}`);
        return null;
      }
      
      this.logger.log(`Cuenta de MangosCash encontrada: ${JSON.stringify(account)}`);
      return account;
    } catch (error) {
      this.logger.error(`Error al buscar cuenta de MangosCash: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      this.logger.log('Obteniendo todas las cuentas de MangosCash');
      const accounts = await this.mangosCashAccountsService.findAll();
      this.logger.log(`Se encontraron ${accounts.length} cuentas de MangosCash`);
      return accounts;
    } catch (error) {
      this.logger.error(`Error al obtener cuentas de MangosCash: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
} 