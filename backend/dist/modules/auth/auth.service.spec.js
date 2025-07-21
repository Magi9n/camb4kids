"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const mockUserRepo = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});
describe('AuthService', () => {
    let service;
    let repo;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User), useFactory: mockUserRepo },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        repo = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    });
    it('debería lanzar error si el email ya existe en registro', async () => {
        repo.findOne = jest.fn().mockResolvedValue({ id: 1, email: 'test@mail.com' });
        await expect(service.register({ email: 'test@mail.com', password: '123456' }))
            .rejects.toThrow();
    });
});
//# sourceMappingURL=auth.service.spec.js.map