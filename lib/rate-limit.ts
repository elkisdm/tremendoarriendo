import 'server-only';

type RateLimiterOptions = {
  windowMs?: number;
  max?: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export function createRateLimiter(options: RateLimiterOptions = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 20;

  const store = new Map<string, RateLimitEntry>();

  async function check(ip: string): Promise<{ ok: boolean; retryAfter?: number }> {
    const now = Date.now();
    const current = store.get(ip);

    if (!current || now >= current.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return { ok: true };
    }

    if (current.count < max) {
      current.count += 1;
      store.set(ip, current);
      return { ok: true };
    }

    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    return { ok: false, retryAfter: Math.max(retryAfterSeconds, 1) };
  }

  return { check };
}


