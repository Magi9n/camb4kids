"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_entity_1 = require("./entities/user.entity");
const password_reset_entity_1 = require("./entities/password-reset.entity");
const email_change_entity_1 = require("./entities/email-change.entity");
const bank_account_entity_1 = require("./entities/bank-account.entity");
const mangos_cash_account_entity_1 = require("./mangos-cash-account.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const bank_accounts_service_1 = require("./bank-accounts.service");
const bank_accounts_controller_1 = require("./bank-accounts.controller");
const mangos_cash_accounts_service_1 = require("./mangos-cash-accounts.service");
const mangos_cash_accounts_controller_1 = require("./mangos-cash-accounts.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                password_reset_entity_1.PasswordReset,
                email_change_entity_1.EmailChange,
                bank_account_entity_1.BankAccount,
                mangos_cash_account_entity_1.MangosCashAccount,
                order_entity_1.Order
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            bank_accounts_service_1.BankAccountsService,
            mangos_cash_accounts_service_1.MangosCashAccountsService
        ],
        controllers: [
            auth_controller_1.AuthController,
            bank_accounts_controller_1.BankAccountsController,
            mangos_cash_accounts_controller_1.MangosCashAccountsController
        ],
        exports: [auth_service_1.AuthService, bank_accounts_service_1.BankAccountsService, mangos_cash_accounts_service_1.MangosCashAccountsService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map