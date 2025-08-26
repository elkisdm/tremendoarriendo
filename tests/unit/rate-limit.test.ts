import { createRateLimiter } from '@lib/rate-limit';

describe('Rate Limiter', () => {
  it('should allow requests within limit', async () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 3 });
    
    // First 3 requests should be allowed
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    
    // 4th request should be blocked
    const result = await limiter.check('192.168.1.1');
    expect(result.ok).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('should reset after window expires', async () => {
    const limiter = createRateLimiter({ windowMs: 100, max: 2 });
    
    // Use up the limit
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    expect((await limiter.check('192.168.1.1')).ok).toBe(false);
    
    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Should be allowed again
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
  });

  it('should handle different IPs independently', async () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 });
    
    // Each IP should have its own limit
    expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    expect((await limiter.check('192.168.1.1')).ok).toBe(false);
    expect((await limiter.check('192.168.1.2')).ok).toBe(true);
    expect((await limiter.check('192.168.1.2')).ok).toBe(false);
  });

  it('should use default values when not specified', async () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 20 });
    
    // Should use default 20 requests per minute
    for (let i = 0; i < 20; i++) {
      expect((await limiter.check('192.168.1.1')).ok).toBe(true);
    }
    
    // 21st request should be blocked
    expect((await limiter.check('192.168.1.1')).ok).toBe(false);
  });
});
