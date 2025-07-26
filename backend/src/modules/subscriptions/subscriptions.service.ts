import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  async createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    // Verificar si ya existe una suscripción con ese email
    const existingSubscription = await this.subscriptionRepo.findOne({
      where: { email: dto.email.toLowerCase() }
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        throw new ConflictException('Ya tienes una suscripción activa con este correo electrónico');
      } else {
        // Reactivar suscripción existente
        existingSubscription.isActive = true;
        return this.subscriptionRepo.save(existingSubscription);
      }
    }

    // Crear nueva suscripción
    const subscription = this.subscriptionRepo.create({
      email: dto.email.toLowerCase(),
      isActive: true,
    });

    return this.subscriptionRepo.save(subscription);
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async unsubscribe(email: string): Promise<void> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { email: email.toLowerCase() }
    });

    if (subscription) {
      subscription.isActive = false;
      await this.subscriptionRepo.save(subscription);
    }
  }
} 