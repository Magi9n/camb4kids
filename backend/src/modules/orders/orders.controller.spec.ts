import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { RatesService } from '../rates/rates.service';
import { CacheService } from '../../common/services/cache.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const orderRepoMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn().mockImplementation(order => ({
        ...order,
        id: 1,
        user: order.user || { id: 1, email: 'test@mail.com', name: 'Test' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      create: jest.fn().mockImplementation(dto => ({
        ...dto,
        user: dto.user || { id: 1, email: 'test@mail.com', name: 'Test' },
      })),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepoMock,
        },
        {
          provide: RatesService,
          useValue: {
            getCurrent: jest.fn().mockResolvedValue({ rate: 3.5 }),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
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
    const result = await controller.create(
      { amount: 100, fromCurrency: 'USD', toCurrency: 'PEN' },
      { user: mockUser }
    );
    expect(result).toHaveProperty('message', 'Orden creada');
  });
}); 