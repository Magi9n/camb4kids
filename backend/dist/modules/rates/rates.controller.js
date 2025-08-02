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
exports.RatesController = void 0;
const common_1 = require("@nestjs/common");
const rates_service_1 = require("./rates.service");
let RatesController = class RatesController {
    constructor(ratesService) {
        this.ratesService = ratesService;
    }
    async getCurrent(req) {
        const apiKey = req.headers['x-public-api-key'];
        console.log('🔍 Backend Rates - Received headers:', Object.keys(req.headers));
        console.log('🔍 Backend Rates - x-public-api-key received:', apiKey ? 'YES' : 'NO');
        console.log('🔍 Backend Rates - API key length:', apiKey ? apiKey.length : 0);
        console.log('🔍 Backend Rates - Expected key length:', process.env.PUBLIC_API_SECRET ? process.env.PUBLIC_API_SECRET.length : 0);
        console.log('🔍 Backend Rates - Keys match:', apiKey === process.env.PUBLIC_API_SECRET);
        if (!apiKey || apiKey !== process.env.PUBLIC_API_SECRET) {
            console.log('❌ Backend Rates - Authorization failed');
            throw new common_1.ForbiddenException('No autorizado');
        }
        console.log('✅ Backend Rates - Authorization successful');
        return this.ratesService.getCurrent();
    }
    async getHistory(from, to) {
        if (!from || !to)
            throw new common_1.BadRequestException('Debe indicar from y to');
        return this.ratesService.getHistory(from, to);
    }
    async getHourly() {
        return this.ratesService.getHourly();
    }
    async getDailyAverages() {
        return this.ratesService.getDailyAverages();
    }
};
exports.RatesController = RatesController;
__decorate([
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getCurrent", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('hourly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getHourly", null);
__decorate([
    (0, common_1.Get)('daily-averages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RatesController.prototype, "getDailyAverages", null);
exports.RatesController = RatesController = __decorate([
    (0, common_1.Controller)('rates'),
    __metadata("design:paramtypes", [rates_service_1.RatesService])
], RatesController);
//# sourceMappingURL=rates.controller.js.map