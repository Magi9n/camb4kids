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
    const currentRate = await this.ratesService.getCurrent();
    if (!currentRate.rate) {
      throw new BadRequestException('No se pudo obtener la tasa de cambio actual');
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

  async history(user: User) {
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
    if (order.status === 'COMPLETADO') {
      throw new BadRequestException('No se puede modificar una orden completada');
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
}


