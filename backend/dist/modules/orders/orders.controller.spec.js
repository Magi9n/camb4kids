"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const rates_service_1 = require("../rates/rates.service");
const cache_service_1 = require("../../common/services/cache.service");
describe('OrdersController', () => {
    let controller;
    beforeEach(async () => {
        const orderRepoMock = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn().mockImplementation(order => (Object.assign(Object.assign({}, order), { id: 1, user: order.user || { id: 1, email: 'test@mail.com', name: 'Test' }, createdAt: new Date(), updatedAt: new Date() }))),
            create: jest.fn().mockImplementation(dto => (Object.assign(Object.assign({}, dto), { user: dto.user || { id: 1, email: 'test@mail.com', name: 'Test' } }))),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [orders_controller_1.OrdersController],
            providers: [
                orders_service_1.OrdersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(order_entity_1.Order),
                    useValue: orderRepoMock,
                },
                {
                    provide: rates_service_1.RatesService,
                    useValue: {
                        getCurrent: jest.fn().mockResolvedValue({ rate: 3.5 }),
                    },
                },
                {
                    provide: cache_service_1.CacheService,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
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
        const result = await controller.create({ amount: 100, fromCurrency: 'USD', toCurrency: 'PEN' }, { user: mockUser });
        expect(result).toMatchObject({
            amount: 100,
            fromCurrency: 'USD',
            toCurrency: 'PEN',
            rate: 3.5,
            total: 350,
            status: 'EN_PROCESO',
        });
        expect(result).toHaveProperty('id');
    });
});
//# sourceMappingURL=orders.controller.spec.js.map