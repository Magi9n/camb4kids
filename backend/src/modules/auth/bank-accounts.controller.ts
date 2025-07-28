import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto/bank-account.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('bank-accounts')
@UseGuards(JwtAuthGuard)
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  async create(@Body() createBankAccountDto: CreateBankAccountDto, @Request() req) {
    console.log('[DEBUG] Creating bank account for user:', req.user);
    console.log('[DEBUG] User ID:', req.user.id);
    console.log('[DEBUG] Bank account data:', createBankAccountDto);
    return await this.bankAccountsService.create(createBankAccountDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    return await this.bankAccountsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.bankAccountsService.findOne(+id, req.user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto, @Request() req) {
    return await this.bankAccountsService.update(+id, updateBankAccountDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return await this.bankAccountsService.remove(+id, req.user.id);
  }
} 