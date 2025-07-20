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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const rates_service_1 = require("../rates/rates.service");
const cache_service_1 = require("../../common/services/cache.service");
let OrdersService = class OrdersService {
    constructor(orderRepo, ratesService, cacheService) {
        this.orderRepo = orderRepo;
        this.ratesService = ratesService;
        this.cacheService = cacheService;
    }
    async create(dto, user) {
        const currentRate = await this.ratesService.getCurrent();
        if (!currentRate.rate) {
            throw new common_1.BadRequestException('No se pudo obtener la tasa de cambio actual');
        }
        const total = dto.amount * currentRate.rate;
        const order = this.orderRepo.create({
            user,
            amount: dto.amount,
            fromCurrency: dto.fromCurrency,
            toCurrency: dto.toCurrency,
            rate: currentRate.rate,
            total,
            status: 'EN_PROCESO',
        });
        await this.orderRepo.save(order);
        this.cacheService.del(`user_orders_${user.id}`);
        return {
            id: order.id,
            amount: order.amount,
            fromCurrency: order.fromCurrency,
            toCurrency: order.toCurrency,
            rate: order.rate,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
        };
    }
    async history(user) {
        const cached = this.cacheService.get(`user_orders_${user.id}`);
        if (cached) {
            return cached;
        }
        const orders = await this.orderRepo.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        const result = orders.map(order => ({
            id: order.id,
            amount: order.amount,
            fromCurrency: order.fromCurrency,
            toCurrency: order.toCurrency,
            rate: order.rate,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
        }));
        this.cacheService.set(`user_orders_${user.id}`, result, 300);
        return result;
    }
    async findById(id, user) {
        const order = await this.orderRepo.findOne({
            where: { id, user: { id: user.id } },
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        return {
            id: order.id,
            amount: order.amount,
            fromCurrency: order.fromCurrency,
            toCurrency: order.toCurrency,
            rate: order.rate,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
    async updateStatus(id, status, user) {
        const order = await this.orderRepo.findOne({
            where: { id, user: { id: user.id } },
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        if (order.status === 'COMPLETADO') {
            throw new common_1.BadRequestException('No se puede modificar una orden completada');
        }
        order.status = status;
        await this.orderRepo.save(order);
        this.cacheService.del(`user_orders_${user.id}`);
        return {
            id: order.id,
            status: order.status,
            updatedAt: order.updatedAt,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        rates_service_1.RatesService,
        cache_service_1.CacheService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map