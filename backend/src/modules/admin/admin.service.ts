import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AdminSetting } from './entities/admin-setting.entity';
import { Order } from '../orders/entities/order.entity';
import { UpdateSettingsDto } from '../../common/dto/update-settings.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import Redis from 'ioredis';

@Injectable()
export class AdminService {
  private readonly redis: Redis;

  constructor(
    @InjectRepository(AdminSetting)
    private readonly settingsRepo: Repository<AdminSetting>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({ 
      host: this.configService.get('REDIS_HOST') || 'localhost', 
      port: parseInt(this.configService.get('REDIS_PORT')) || 6379 
    });
  }

  async getSettings() {
    // Intentar obtener del caché
    const cached = await this.redis.get('admin_settings');
    if (cached) {
      return JSON.parse(cached);
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
    await this.redis.setex('admin_settings', 600, JSON.stringify(result));

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
    await this.redis.del('admin_settings');

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
    await this.redis.del(`user_orders_${order.user.id}`);

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
    const totalOrders = await this.orderRepo.count();
    const completedOrders = await this.orderRepo.count({ where: { status: 'COMPLETADO' } });
    const pendingOrders = await this.orderRepo.count({ where: { status: 'EN_PROCESO' } });
    const depositedOrders = await this.orderRepo.count({ where: { status: 'DEPOSITADO' } });

    const totalAmount = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'total')
      .getRawOne();

    const completedAmount = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'total')
      .where('order.status = :status', { status: 'COMPLETADO' })
      .getRawOne();

    return {
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        deposited: depositedOrders,
      },
      amounts: {
        total: parseFloat(totalAmount?.total || '0'),
        completed: parseFloat(completedAmount?.total || '0'),
      },
    };
  }
} 