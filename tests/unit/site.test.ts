import { getBaseUrl } from '@lib/site';

describe('site', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getBaseUrl', () => {
    it('returns NEXT_PUBLIC_SITE_URL when available', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://hommie.cl';
      expect(getBaseUrl()).toBe('https://hommie.cl');
    });

    it('returns Vercel URL when NEXT_PUBLIC_SITE_URL is not available', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      process.env.VERCEL_URL = 'hommie-staging.vercel.app';
      expect(getBaseUrl()).toBe('https://hommie-staging.vercel.app');
    });

    it('returns localhost when neither environment variable is available', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      delete process.env.VERCEL_URL;
      expect(getBaseUrl()).toBe('http://localhost:3000');
    });

    it('prefers NEXT_PUBLIC_SITE_URL over VERCEL_URL', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://hommie.cl';
      process.env.VERCEL_URL = 'hommie-staging.vercel.app';
      expect(getBaseUrl()).toBe('https://hommie.cl');
    });
  });
});
