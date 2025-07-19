import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
    const result = await controller.create({ amount: 100 }, { id: 1, email: 'test@mail.com' });
    expect(result).toHaveProperty('message', 'Orden creada');
  });
}); 