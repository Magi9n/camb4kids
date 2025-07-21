export declare class RegisterDto {
    email: string;
    password: string;
}
export declare class VerifyEmailDto {
    email: string;
    code: string;
}
export declare class CompleteProfileDto {
    email: string;
    documentType: string;
    document: string;
    name: string;
    lastname: string;
    sex: string;
    phone: string;
}
