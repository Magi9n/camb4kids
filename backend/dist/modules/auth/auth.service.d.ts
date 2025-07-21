import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class AuthService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    completeProfile(dto: CompleteProfileDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            lastname: string;
            role: string;
        };
    }>;
    refresh(token: string): Promise<{
        token: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    cleanUnverifiedUsers(): Promise<{
        deleted: number;
    }>;
}
