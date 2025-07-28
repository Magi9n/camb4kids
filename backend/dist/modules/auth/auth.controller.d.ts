import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyResetToken(body: {
        token: string;
    }): Promise<{
        valid: {
            valid: boolean;
            message: string;
            email?: undefined;
        } | {
            valid: boolean;
            email: string;
            message?: undefined;
        };
    }>;
    verifyToken(req: any): Promise<{
        valid: boolean;
        user: {
            id: any;
            email: any;
            name: any;
            lastname: any;
            role: any;
        };
    }>;
}
