"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
describe('OrdersController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [orders_controller_1.OrdersController],
            providers: [orders_service_1.OrdersService],
        })
            .overrideGuard(jwt_auth_guard_1.JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();
        controller = module.get(orders_controller_1.OrdersController);
    });
    it('debería permitir crear orden autenticado', async () => {
        const mockUser = {
            id: 1,
            email: 'test@mail.com',
            password: 'hashed',
            name: 'Test',
            role: 'user',
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
//# sourceMappingURL=orders.controller.spec.js.map