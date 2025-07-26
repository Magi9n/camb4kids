import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionsService.createSubscription(dto);
    return {
      message: 'Suscripción creada exitosamente',
      subscription: {
        id: subscription.id,
        email: subscription.email,
        createdAt: subscription.createdAt
      }
    };
  }

  @Get()
  async findAll() {
    const subscriptions = await this.subscriptionsService.getAllSubscriptions();
    return {
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        email: sub.email,
        createdAt: sub.createdAt
      }))
    };
  }
} 