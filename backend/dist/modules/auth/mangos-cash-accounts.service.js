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
var MangosCashAccountsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangosCashAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mangos_cash_account_entity_1 = require("./mangos-cash-account.entity");
let MangosCashAccountsService = MangosCashAccountsService_1 = class MangosCashAccountsService {
    constructor(mangosCashAccountRepository) {
        this.mangosCashAccountRepository = mangosCashAccountRepository;
        this.logger = new common_1.Logger(MangosCashAccountsService_1.name);
    }
    async findByBankAndCurrency(bank, currency) {
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
            }
            else {
                this.logger.warn(`No se encontró cuenta en BD para banco: ${bank}, moneda: ${currency}`);
            }
            return account;
        }
        catch (error) {
            this.logger.error(`Error en servicio al buscar cuenta: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async findAll() {
        try {
            this.logger.log('Obteniendo todas las cuentas de MangosCash desde BD');
            const accounts = await this.mangosCashAccountRepository.find({
                where: { isActive: true },
                order: { bank: 'ASC', currency: 'ASC' }
            });
            this.logger.log(`Se encontraron ${accounts.length} cuentas activas en BD`);
            return accounts;
        }
        catch (error) {
            this.logger.error(`Error en servicio al obtener todas las cuentas: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async create(accountData) {
        const account = this.mangosCashAccountRepository.create(accountData);
        return this.mangosCashAccountRepository.save(account);
    }
    async update(id, accountData) {
        await this.mangosCashAccountRepository.update(id, accountData);
        return this.mangosCashAccountRepository.findOne({ where: { id } });
    }
    async delete(id) {
        await this.mangosCashAccountRepository.delete(id);
    }
};
exports.MangosCashAccountsService = MangosCashAccountsService;
exports.MangosCashAccountsService = MangosCashAccountsService = MangosCashAccountsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mangos_cash_account_entity_1.MangosCashAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MangosCashAccountsService);
//# sourceMappingURL=mangos-cash-accounts.service.js.map