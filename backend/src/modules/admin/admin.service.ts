import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AdminSetting } from './entities/admin-setting.entity';
import { Order } from '../orders/entities/order.entity';
import { UpdateSettingsDto } from '../../common/dto/update-settings.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { CacheService } from '../../common/services/cache.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminSetting)
    private readonly settingsRepo: Repository<AdminSetting>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  async getSettings() {
    // Intentar obtener del caché
    const cached = this.cacheService.get('admin_settings');
    if (cached) {
      return cached;
    }

    // Obtener de la base de datos
    let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    
    if (!settings) {
      // Crear configuración por defecto
      settings = this.settingsRepo.create({
        variationPercent: 0.02,
        cronStart: '08:00',
        cronEnd: '20:00',
      });
      await this.settingsRepo.save(settings);
    }

    const result = {
      id: settings.id,
      variationPercent: settings.variationPercent,
      cronStart: settings.cronStart,
      cronEnd: settings.cronEnd,
      updatedAt: settings.updatedAt,
    };

    // Guardar en caché por 10 minutos
    this.cacheService.set('admin_settings', result, 600);

    return result;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    
    if (!settings) {
      settings = this.settingsRepo.create({
        variationPercent: 0.02,
        cronStart: '08:00',
        cronEnd: '20:00',
      });
    }

    // Actualizar campos si están presentes
    if (dto.variationPercent !== undefined) {
      settings.variationPercent = dto.variationPercent;
    }

    if (dto.cronStart !== undefined) {
      settings.cronStart = dto.cronStart;
    }

    if (dto.cronEnd !== undefined) {
      settings.cronEnd = dto.cronEnd;
    }

    await this.settingsRepo.save(settings);

    // Limpiar caché
    this.cacheService.del('admin_settings');

    return {
      id: settings.id,
      variationPercent: settings.variationPercent,
      cronStart: settings.cronStart,
      cronEnd: settings.cronEnd,
      updatedAt: settings.updatedAt,
    };
  }

  async getOrders(page: number = 1, limit: number = 20, status?: string) {
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

  async updateOrder(id: number, dto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Validar status
    if (!['EN_PROCESO', 'DEPOSITADO', 'COMPLETADO'].includes(dto.status)) {
      throw new BadRequestException('Status inválido');
    }

    // Validar transición de estado
    if (order.status === 'COMPLETADO' && dto.status !== 'COMPLETADO') {
      throw new BadRequestException('No se puede revertir una orden completada');
    }

    order.status = dto.status as any;
    await this.orderRepo.save(order);

    // Limpiar caché del usuario
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
    // Intentar obtener del caché
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

    // Guardar en caché por 2 minutos
    this.cacheService.set('admin_stats', stats, 120);

    return stats;
  }

  async getAllOrders(page: number = 1, limit: number = 10) {
    const cacheKey = `admin_orders_${page}_${limit}`;
    
    // Intentar obtener del caché
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

    // Guardar en caché por 1 minuto
    this.cacheService.set(cacheKey, result, 60);

    return result;
  }

  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Orden no encontrada');
    }

    order.status = status as any;
    await this.orderRepo.save(order);

    // Limpiar caché relacionado
    this.cacheService.del('admin_stats');
    this.cacheService.del(`user_orders_${order.user.id}`);
    this.cacheService.del(`user_stats_${order.user.id}`);
    
    // Limpiar caché de listado de órdenes
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

  // Método para limpiar caché manualmente
  async clearCache() {
    const stats = this.cacheService.getStats();
    this.cacheService.clear();
    return {
      message: 'Caché limpiado exitosamente',
      previousStats: stats,
    };
  }

  // Método para obtener estadísticas del caché
  async getCacheStats() {
    return this.cacheService.getStats();
  }
} 