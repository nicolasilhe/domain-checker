import { DomainCheckResult } from "@/types/domain";

type CacheEntry = {
  data: DomainCheckResult;
  timestamp: number;
};

const config = {
  cacheDuration: process.env.CACHE_DURATION
    ? parseInt(process.env.CACHE_DURATION)
    : 5 * 60 * 1000,
  maxEntries: 1000,
};

export class DomainCache {
  private static cache = new Map<string, CacheEntry>();

  static set(domain: string, data: DomainCheckResult): void {
    this.cache.set(domain, {
      data,
      timestamp: Date.now(),
    });
  }

  static get(domain: string): DomainCheckResult | null {
    const entry = this.cache.get(domain);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > config.cacheDuration) {
      this.cache.delete(domain);
      return null;
    }

    return entry.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [domain, entry] of this.cache.entries()) {
      if (now - entry.timestamp > config.cacheDuration) {
        this.cache.delete(domain);
      }
    }
  }

  static prune(): void {
    if (this.cache.size > config.maxEntries) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);

      const toDelete = entries.slice(config.maxEntries);
      toDelete.forEach(([domain]) => this.cache.delete(domain));
    }
  }
}
