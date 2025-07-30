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
import { Operation } from './operation.entity';
import { JwtStrategy } from './jwt.strategy';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { MangosCashAccountsService } from './mangos-cash-accounts.service';
import { MangosCashAccountsController } from './mangos-cash-accounts.controller';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      PasswordReset, 
      EmailChange, 
      BankAccount,
      MangosCashAccount,
      Operation
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
    JwtStrategy, 
    BankAccountsService,
    MangosCashAccountsService,
    OperationsService
  ],
  controllers: [
    AuthController, 
    BankAccountsController,
    MangosCashAccountsController,
    OperationsController
  ],
  exports: [AuthService, BankAccountsService, MangosCashAccountsService, OperationsService],
})
export class AuthModule {} 