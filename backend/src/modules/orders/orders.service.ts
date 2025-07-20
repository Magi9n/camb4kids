import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { RatesService } from '../rates/rates.service';
import { CreateOrderDto } from '../../common/dto/create-order.dto';
import { CacheService } from '../../common/services/cache.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly ratesService: RatesService,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreateOrderDto, user: User) {
    // Obtener tasa actual
    const currentRate = await this.ratesService.getCurrent();
    if (!currentRate.rate) {
      throw new BadRequestException('No se pudo obtener la tasa de cambio actual');
    }

    // Calcular total
    const total = dto.amount * currentRate.rate;

    // Crear orden
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

    // Limpiar caché de historial del usuario
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

  async history(user: User) {
    // Intentar obtener del caché
    const cached = this.cacheService.get(`user_orders_${user.id}`);
    if (cached) {
      return cached;
    }

    // Obtener de la base de datos
    const orders = await this.orderRepo.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      take: 50, // Limitar a las últimas 50 órdenes
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

    // Guardar en caché por 5 minutos
    this.cacheService.set(`user_orders_${user.id}`, result, 300);

    return result;
  }

  async findById(id: number, user: User) {
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
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

  async updateStatus(id: number, status: OrderStatus, user: User) {
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Validar transición de estado
    if (order.status === 'COMPLETADO') {
      throw new BadRequestException('No se puede modificar una orden completada');
    }

    order.status = status;
    await this.orderRepo.save(order);

    // Limpiar caché
    this.cacheService.del(`user_orders_${user.id}`);

    return {
      id: order.id,
      status: order.status,
      updatedAt: order.updatedAt,
    };
  }
} 