import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MangosCashAccountsService } from './mangos-cash-accounts.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('admin/mangos-cash-accounts')
@UseGuards(JwtAuthGuard)
export class MangosCashAccountsController {
  constructor(private readonly mangosCashAccountsService: MangosCashAccountsService) {}

  @Get(':bank/:currency')
  async findByBankAndCurrency(
    @Param('bank') bank: string,
    @Param('currency') currency: string,
  ) {
    return this.mangosCashAccountsService.findByBankAndCurrency(bank, currency);
  }

  @Get()
  async findAll() {
    return this.mangosCashAccountsService.findAll();
  }
} 