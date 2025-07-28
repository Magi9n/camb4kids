export declare class EmailChange {
    id: number;
    userId: number;
    currentEmail: string;
    newEmail: string;
    verificationCode: string;
    expiresAt: Date;
    verified: boolean;
    createdAt: Date;
}
