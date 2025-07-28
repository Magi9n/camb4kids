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
exports.BankAccountsController = void 0;
const common_1 = require("@nestjs/common");
const bank_accounts_service_1 = require("./bank-accounts.service");
const bank_account_dto_1 = require("./dto/bank-account.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let BankAccountsController = class BankAccountsController {
    constructor(bankAccountsService) {
        this.bankAccountsService = bankAccountsService;
    }
    async create(createBankAccountDto, req) {
        console.log('[DEBUG] Creating bank account for user:', req.user);
        console.log('[DEBUG] User ID:', req.user.id);
        console.log('[DEBUG] Bank account data:', createBankAccountDto);
        return await this.bankAccountsService.create(createBankAccountDto, req.user.id);
    }
    async findAll(req) {
        return await this.bankAccountsService.findAllByUser(req.user.id);
    }
    async findOne(id, req) {
        return await this.bankAccountsService.findOne(+id, req.user.id);
    }
    async update(id, updateBankAccountDto, req) {
        return await this.bankAccountsService.update(+id, updateBankAccountDto, req.user.id);
    }
    async remove(id, req) {
        return await this.bankAccountsService.remove(+id, req.user.id);
    }
};
exports.BankAccountsController = BankAccountsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_account_dto_1.CreateBankAccountDto, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bank_account_dto_1.UpdateBankAccountDto, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "remove", null);
exports.BankAccountsController = BankAccountsController = __decorate([
    (0, common_1.Controller)('bank-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bank_accounts_service_1.BankAccountsService])
], BankAccountsController);
//# sourceMappingURL=bank-accounts.controller.js.map