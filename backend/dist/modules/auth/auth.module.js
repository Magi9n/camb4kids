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
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const bank_accounts_controller_1 = require("./bank-accounts.controller");
const bank_accounts_service_1 = require("./bank-accounts.service");
const user_entity_1 = require("./entities/user.entity");
const password_reset_entity_1 = require("./entities/password-reset.entity");
const bank_account_entity_1 = require("./entities/bank-account.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, password_reset_entity_1.PasswordReset, bank_account_entity_1.BankAccount])],
        controllers: [auth_controller_1.AuthController, bank_accounts_controller_1.BankAccountsController],
        providers: [auth_service_1.AuthService, bank_accounts_service_1.BankAccountsService],
        exports: [auth_service_1.AuthService, bank_accounts_service_1.BankAccountsService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map