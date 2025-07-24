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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const admin_setting_entity_1 = require("./entities/admin-setting.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const cache_service_1 = require("../../common/services/cache.service");
const user_entity_1 = require("../auth/entities/user.entity");
let AdminService = class AdminService {
    constructor(settingsRepo, orderRepo, userRepo, configService, cacheService) {
        this.settingsRepo = settingsRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.configService = configService;
        this.cacheService = cacheService;
    }
    async getSettings() {
        const cached = this.cacheService.get('admin_settings');
        if (cached) {
            return cached;
        }
        let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
        if (!settings) {
            settings = this.settingsRepo.create({
                variationPercent: 0.02,
                cronStart: '08:00',
                cronEnd: '20:00',
                buyPercent: 1,
                sellPercent: 1,
            });
            await this.settingsRepo.save(settings);
        }
        const result = {
            id: settings.id,
            variationPercent: settings.variationPercent,
            buyPercent: settings.buyPercent,
            sellPercent: settings.sellPercent,
            cronStart: settings.cronStart,
            cronEnd: settings.cronEnd,
            updatedAt: settings.updatedAt,
        };
        this.cacheService.set('admin_settings', result, 600);
        return result;
    }
    async updateSettings(dto) {
        let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
        if (!settings) {
            settings = this.settingsRepo.create({
                variationPercent: 0.02,
                cronStart: '08:00',
                cronEnd: '20:00',
                buyPercent: 1,
                sellPercent: 1,
            });
        }
        if (dto.variationPercent !== undefined) {
            settings.variationPercent = dto.variationPercent;
        }
        if (dto.buyPercent !== undefined) {
            settings.buyPercent = dto.buyPercent;
        }
        if (dto.sellPercent !== undefined) {
            settings.sellPercent = dto.sellPercent;
        }
        if (dto.cronStart !== undefined) {
            settings.cronStart = dto.cronStart;
        }
        if (dto.cronEnd !== undefined) {
            settings.cronEnd = dto.cronEnd;
        }
        await this.settingsRepo.save(settings);
        this.cacheService.del('admin_settings');
        return {
            id: settings.id,
            variationPercent: settings.variationPercent,
            buyPercent: settings.buyPercent,
            sellPercent: settings.sellPercent,
            cronStart: settings.cronStart,
            cronEnd: settings.cronEnd,
            updatedAt: settings.updatedAt,
        };
    }
    async getOrders(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const query = this.orderRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .select([
            'order.id',
            'order.amount',
            'order.fromCurrency',
            'order.toCurrency',
            'order.rate',
            'order.total',
            'order.status',
            'order.createdAt',
            'order.updatedAt',
            'user.id',
            'user.email',
            'user.name',
        ])
            .orderBy('order.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (status) {
            query.andWhere('order.status = :status', { status });
        }
        const [orders, total] = await query.getManyAndCount();
        return {
            orders: orders.map(order => ({
                id: order.id,
                amount: order.amount,
                fromCurrency: order.fromCurrency,
                toCurrency: order.toCurrency,
                rate: order.rate,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                user: {
                    id: order.user.id,
                    email: order.user.email,
                    name: order.user.name,
                },
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async updateOrder(id, dto) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        if (!['EN_PROCESO', 'DEPOSITADO', 'COMPLETADO'].includes(dto.status)) {
            throw new common_1.BadRequestException('Status inválido');
        }
        if (order.status === 'COMPLETADO' && dto.status !== 'COMPLETADO') {
            throw new common_1.BadRequestException('No se puede revertir una orden completada');
        }
        order.status = dto.status;
        await this.orderRepo.save(order);
        await this.cacheService.del(`user_orders_${order.user.id}`);
        return {
            id: order.id,
            status: order.status,
            updatedAt: order.updatedAt,
            user: {
                id: order.user.id,
                email: order.user.email,
                name: order.user.name,
            },
        };
    }
    async getStats() {
        const cached = this.cacheService.get('admin_stats');
        if (cached) {
            return cached;
        }
        const [orders, totalOrders] = await this.orderRepo.findAndCount();
        const [users, totalUsers] = await this.userRepo.findAndCount();
        const completedOrders = orders.filter(order => order.status === 'COMPLETADO');
        const pendingOrders = orders.filter(order => order.status === 'EN_PROCESO');
        const depositedOrders = orders.filter(order => order.status === 'DEPOSITADO');
        const totalAmount = orders.reduce((sum, order) => sum + Number(order.amount), 0);
        const completedAmount = completedOrders.reduce((sum, order) => sum + Number(order.amount), 0);
        const stats = {
            orders: {
                total: totalOrders,
                completed: completedOrders.length,
                pending: pendingOrders.length,
                deposited: depositedOrders.length,
            },
            amounts: {
                total: totalAmount,
                completed: completedAmount,
            },
            users: {
                total: totalUsers,
            },
        };
        this.cacheService.set('admin_stats', stats, 120);
        return stats;
    }
    async getAllOrders(page = 1, limit = 10) {
        const cacheKey = `admin_orders_${page}_${limit}`;
        const cached = this.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const [orders, total] = await this.orderRepo.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const result = {
            orders: orders.map(order => ({
                id: order.id,
                amount: order.amount,
                fromCurrency: order.fromCurrency,
                toCurrency: order.toCurrency,
                rate: order.rate,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                user: {
                    id: order.user.id,
                    email: order.user.email,
                    name: order.user.name,
                },
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
        this.cacheService.set(cacheKey, result, 60);
        return result;
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['user'],
        });
        if (!order) {
            throw new Error('Orden no encontrada');
        }
        order.status = status;
        await this.orderRepo.save(order);
        this.cacheService.del('admin_stats');
        this.cacheService.del(`user_orders_${order.user.id}`);
        this.cacheService.del(`user_stats_${order.user.id}`);
        this.cacheService.delMultiple([
            'admin_orders_1_10',
            'admin_orders_1_20',
            'admin_orders_1_50',
        ]);
        return {
            id: order.id,
            status: order.status,
            updatedAt: order.updatedAt,
        };
    }
    async clearCache() {
        const stats = this.cacheService.getStats();
        this.cacheService.clear();
        return {
            message: 'Caché limpiado exitosamente',
            previousStats: stats,
        };
    }
    async getCacheStats() {
        return this.cacheService.getStats();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_setting_entity_1.AdminSetting)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        cache_service_1.CacheService])
], AdminService);
//# sourceMappingURL=admin.service.js.map