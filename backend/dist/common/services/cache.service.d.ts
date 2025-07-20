export declare class CacheService {
    private cache;
    set<T>(key: string, value: T, ttlSeconds?: number): void;
    get<T>(key: string): T | null;
    del(key: string): boolean;
    delMultiple(keys: string[]): number;
    cleanup(): number;
    getStats(): {
        total: number;
        valid: number;
        expired: number;
    };
    clear(): void;
}
