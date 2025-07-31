import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { EmailChange } from './entities/email-change.entity';
import { BankAccount } from './entities/bank-account.entity';
import { MangosCashAccount } from './mangos-cash-account.entity';
import { Order } from '../orders/entities/order.entity';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { MangosCashAccountsService } from './mangos-cash-accounts.service';
import { MangosCashAccountsController } from './mangos-cash-accounts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      PasswordReset, 
      EmailChange, 
      BankAccount,
      MangosCashAccount,
      Order
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService, 
    BankAccountsService,
    MangosCashAccountsService
  ],
  controllers: [
    AuthController, 
    BankAccountsController,
    MangosCashAccountsController
  ],
  exports: [AuthService, BankAccountsService, MangosCashAccountsService],
})
export class AuthModule {} 