import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<OrdersController>(OrdersController);
  });

  it('debería permitir crear orden autenticado', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@mail.com',
      password: 'hashed',
      name: 'Test',
      lastname: 'User',
      role: 'user',
      isVerified: true,
      verificationCode: '123456',
      verificationExpires: new Date(),
      phone: '999999999',
      documentType: 'DNI',
      document: '12345678',
      sex: 'M',
      createdAt: new Date(),
      updatedAt: new Date(),
      orders: [],
    };
    const result = await controller.create({ 
      amount: 100, 
      fromCurrency: 'USD', 
      toCurrency: 'PEN' 
    }, mockUser);
    expect(result).toHaveProperty('message', 'Orden creada');
  });
}); 