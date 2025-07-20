import { Injectable } from '@nestjs/common';

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();

  /**
   * Establece un valor en caché con TTL
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Obtiene un valor del caché
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Elimina un elemento del caché
   */
  del(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Elimina múltiples elementos del caché
   */
  delMultiple(keys: string[]): number {
    let deleted = 0;
    keys.forEach(key => {
      if (this.cache.delete(key)) {
        deleted++;
      }
    });
    return deleted;
  }

  /**
   * Limpia elementos expirados
   */
  cleanup(): number {
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

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;
    
    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return {
      total: this.cache.size,
      valid,
      expired,
    };
  }

  /**
   * Limpia todo el caché
   */
  clear(): void {
    this.cache.clear();
  }
} 