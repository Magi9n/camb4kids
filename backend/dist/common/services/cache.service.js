"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    constructor() {
        this.cache = new Map();
    }
    set(key, value, ttlSeconds = 300) {
        const expiresAt = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { value, expiresAt });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return null;
        }
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    del(key) {
        return this.cache.delete(key);
    }
    delMultiple(keys) {
        let deleted = 0;
        keys.forEach(key => {
            if (this.cache.delete(key)) {
                deleted++;
            }
        });
        return deleted;
    }
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        return cleaned;
    }
    getStats() {
        const now = Date.now();
        let valid = 0;
        let expired = 0;
        for (const item of this.cache.values()) {
            if (now > item.expiresAt) {
                expired++;
            }
            else {
                valid++;
            }
        }
        return {
            total: this.cache.size,
            valid,
            expired,
        };
    }
    clear() {
        this.cache.clear();
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map