import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

const mockUserRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('debería lanzar error si el email ya existe en registro', async () => {
    repo.findOne = jest.fn().mockResolvedValue({ id: 1, email: 'test@mail.com' });
    await expect(service.register({ email: 'test@mail.com', password: '123456' }))
      .rejects.toThrow();
  });
}); 