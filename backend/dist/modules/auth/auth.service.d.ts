import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly passwordResetRepo;
    constructor(userRepo: Repository<User>, passwordResetRepo: Repository<PasswordReset>);
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyResetToken(token: string): Promise<{
        valid: boolean;
        message: string;
        email?: undefined;
    } | {
        valid: boolean;
        email: string;
        message?: undefined;
    }>;
    private sendPasswordResetEmail;
    cleanUnverifiedUsers(): Promise<{
        deleted: number;
    }>;
}
