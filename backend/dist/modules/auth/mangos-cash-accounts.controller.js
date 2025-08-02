"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MangosCashAccountsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangosCashAccountsController = void 0;
const common_1 = require("@nestjs/common");
const mangos_cash_accounts_service_1 = require("./mangos-cash-accounts.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let MangosCashAccountsController = MangosCashAccountsController_1 = class MangosCashAccountsController {
    constructor(mangosCashAccountsService) {
        this.mangosCashAccountsService = mangosCashAccountsService;
        this.logger = new common_1.Logger(MangosCashAccountsController_1.name);
    }
    async findByBankAndCurrency(bank, currency) {
        try {
            this.logger.log(`Buscando cuenta de MangosCash para banco: ${bank}, moneda: ${currency}`);
            const account = await this.mangosCashAccountsService.findByBankAndCurrency(bank, currency);
            if (!account) {
                this.logger.warn(`No se encontró cuenta de MangosCash para banco: ${bank}, moneda: ${currency}`);
                return null;
            }
            this.logger.log(`Cuenta de MangosCash encontrada: ${JSON.stringify(account)}`);
            return account;
        }
        catch (error) {
            this.logger.error(`Error al buscar cuenta de MangosCash: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async findAll() {
        try {
            this.logger.log('Obteniendo todas las cuentas de MangosCash');
            const accounts = await this.mangosCashAccountsService.findAll();
            this.logger.log(`Se encontraron ${accounts.length} cuentas de MangosCash`);
            return accounts;
        }
        catch (error) {
            this.logger.error(`Error al obtener cuentas de MangosCash: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
};
exports.MangosCashAccountsController = MangosCashAccountsController;
__decorate([
    (0, common_1.Get)(':bank/:currency'),
    __param(0, (0, common_1.Param)('bank')),
    __param(1, (0, common_1.Param)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MangosCashAccountsController.prototype, "findByBankAndCurrency", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MangosCashAccountsController.prototype, "findAll", null);
exports.MangosCashAccountsController = MangosCashAccountsController = MangosCashAccountsController_1 = __decorate([
    (0, common_1.Controller)('admin/mangos-cash-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [mangos_cash_accounts_service_1.MangosCashAccountsService])
], MangosCashAccountsController);
//# sourceMappingURL=mangos-cash-accounts.controller.js.map