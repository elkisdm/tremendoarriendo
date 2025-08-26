import 'server-only';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

interface RateLimitResult {
  ok: boolean;
  retryAfter?: number;
}

class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const key = identifier;
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // First request or window expired
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return { ok: true };
    }

    if (record.count >= this.config.max) {
      // Rate limit exceeded
      return {
        ok: false,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      };
    }

    // Increment count
    record.count++;
    this.store.set(key, record);
    return { ok: true };
  }

  async reset(identifier: string): Promise<void> {
    this.store.delete(identifier);
  }
}

export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}


