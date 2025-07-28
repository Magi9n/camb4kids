import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { BankAccount } from './entities/bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordReset, BankAccount])],
  controllers: [AuthController, BankAccountsController],
  providers: [AuthService, BankAccountsService],
  exports: [AuthService, BankAccountsService],
})
export class AuthModule {} 