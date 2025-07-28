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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bank_account_entity_1 = require("./entities/bank-account.entity");
let BankAccountsService = class BankAccountsService {
    constructor(bankAccountRepo) {
        this.bankAccountRepo = bankAccountRepo;
    }
    async create(createBankAccountDto, userId) {
        const bankAccount = this.bankAccountRepo.create(Object.assign(Object.assign({}, createBankAccountDto), { userId }));
        return await this.bankAccountRepo.save(bankAccount);
    }
    async findAllByUser(userId) {
        return await this.bankAccountRepo.find({
            where: { userId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const bankAccount = await this.bankAccountRepo.findOne({
            where: { id, userId, isActive: true },
        });
        if (!bankAccount) {
            throw new common_1.NotFoundException('Cuenta bancaria no encontrada');
        }
        return bankAccount;
    }
    async update(id, updateBankAccountDto, userId) {
        const bankAccount = await this.findOne(id, userId);
        Object.assign(bankAccount, updateBankAccountDto);
        return await this.bankAccountRepo.save(bankAccount);
    }
    async remove(id, userId) {
        const bankAccount = await this.findOne(id, userId);
        bankAccount.isActive = false;
        await this.bankAccountRepo.save(bankAccount);
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bank_account_entity_1.BankAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BankAccountsService);
//# sourceMappingURL=bank-accounts.service.js.map