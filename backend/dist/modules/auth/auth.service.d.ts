import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto, UpdateProfileDto, ChangeEmailDto, VerifyNewEmailDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { EmailChange } from './entities/email-change.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly passwordResetRepo;
    private readonly emailChangeRepo;
    constructor(userRepo: Repository<User>, passwordResetRepo: Repository<PasswordReset>, emailChangeRepo: Repository<EmailChange>);
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
    cleanUnverifiedUsers(): Promise<void>;
    getProfileStatus(user: User): Promise<{
        isComplete: boolean;
        missingFields: string[];
    }>;
    private getMissingFields;
    getProfile(user: User): Promise<{
        id: number;
        email: string;
        name: string;
        lastname: string;
        documentType: string;
        document: string;
        sex: string;
        phone: string;
        role: string;
        isVerified: boolean;
    }>;
    updateProfile(dto: UpdateProfileDto, user: User): Promise<{
        message: string;
    }>;
    changeEmail(dto: ChangeEmailDto, user: User): Promise<{
        message: string;
    }>;
    verifyNewEmail(dto: VerifyNewEmailDto, user: User): Promise<{
        message: string;
    }>;
    private sendEmailChangeVerification;
}
