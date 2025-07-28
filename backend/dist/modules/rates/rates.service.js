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
var RatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exchange_rate_entity_1 = require("./entities/exchange-rate.entity");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const ioredis_1 = require("ioredis");
let RatesService = RatesService_1 = class RatesService {
    constructor(rateRepo, configService) {
        this.rateRepo = rateRepo;
        this.configService = configService;
        this.logger = new common_1.Logger(RatesService_1.name);
        this.redis = new ioredis_1.default({
            host: this.configService.get('REDIS_HOST') || 'localhost',
            port: parseInt(this.configService.get('REDIS_PORT')) || 6379
        });
    }
    async fetchRate() {
        try {
            const url = `${this.configService.get('TWELVEDATA_API_URL')}&apikey=${this.configService.get('TWELVEDATA_API_KEY')}`;
            const { data } = await axios_1.default.get(url);
            const rate = parseFloat(data.price);
            if (!rate)
                throw new Error('No se pudo obtener la tasa');
            const exRate = this.rateRepo.create({
                fromCurrency: 'USD',
                toCurrency: 'PEN',
                rate,
            });
            await this.rateRepo.save(exRate);
            const allRates = await this.rateRepo.find({ order: { createdAt: 'ASC' } });
            if (allRates.length > 1) {
                const oldest = allRates[0];
                await this.rateRepo.delete(oldest.id);
            }
            await this.redis.set('EXCHANGE_RATE_USD_PEN', rate, 'EX', 70);
            this.logger.log(`Tasa actualizada: ${rate}`);
        }
        catch (e) {
            this.logger.error('Error al actualizar tasa', e);
        }
    }
    async getCurrent() {
        var _a, _b;
        let rate = await this.redis.get('EXCHANGE_RATE_USD_PEN');
        if (!rate) {
            const last = await this.rateRepo.find({ order: { createdAt: 'DESC' }, take: 1 });
            rate = ((_b = (_a = last[0]) === null || _a === void 0 ? void 0 : _a.rate) === null || _b === void 0 ? void 0 : _b.toString()) || null;
        }
        return { rate: rate ? parseFloat(rate) : null };
    }
    async getHistory(from, to) {
        const history = await this.rateRepo.find({
            where: {
                createdAt: (0, typeorm_2.Between)(new Date(from), new Date(to)),
            },
            order: { createdAt: 'ASC' },
        });
        return { history };
    }
    async getHourly() {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const history = await this.rateRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(oneHourAgo, now) },
            order: { createdAt: 'ASC' },
        });
        return history.map(r => ({
            time: r.createdAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(Number(r.rate).toFixed(3)),
        }));
    }
};
exports.RatesService = RatesService;
__decorate([
    (0, schedule_1.Cron)('48 */1 * * * *', { name: 'fetchRate' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RatesService.prototype, "fetchRate", null);
exports.RatesService = RatesService = RatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exchange_rate_entity_1.ExchangeRate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], RatesService);
//# sourceMappingURL=rates.service.js.map