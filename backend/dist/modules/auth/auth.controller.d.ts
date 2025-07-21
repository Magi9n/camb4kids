import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto } from './dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyEmail(dto: VerifyEmailDto, res: Response): Promise<Response<any, Record<string, any>>>;
    completeProfile(dto: CompleteProfileDto, res: Response): Promise<Response<any, Record<string, any>>>;
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
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
