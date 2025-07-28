import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto, UpdateProfileDto, ChangeEmailDto, VerifyNewEmailDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    completeProfile(completeProfileDto: CompleteProfileDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            lastname: string;
            role: string;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verify(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
    getProfileStatus(req: any): Promise<{
        isComplete: boolean;
        missingFields: string[];
    }>;
    getProfile(req: any): Promise<{
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
    updateProfile(updateProfileDto: UpdateProfileDto, req: any): Promise<{
        message: string;
    }>;
    changeEmail(changeEmailDto: ChangeEmailDto, req: any): Promise<{
        message: string;
    }>;
    verifyNewEmail(verifyNewEmailDto: VerifyNewEmailDto, req: any): Promise<{
        message: string;
    }>;
}
