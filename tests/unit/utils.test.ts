import { clx, formatPrice, currency, fakeDelay } from '@lib/utils';

describe('utils', () => {
  describe('clx', () => {
    it('combines class names correctly', () => {
      expect(clx('a', 'b', 'c')).toBe('a b c');
    });

    it('filters out falsy values', () => {
      expect(clx('a', false, 'b', null, 'c', undefined, '')).toBe('a b c');
    });

    it('handles empty input', () => {
      expect(clx()).toBe('');
    });
  });

  describe('formatPrice', () => {
    it('formats Chilean pesos correctly', () => {
      expect(formatPrice(1000000)).toBe('$1.000.000');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0');
    });

    it('handles undefined', () => {
      expect(formatPrice()).toBe('$0');
    });

    it('handles large numbers', () => {
      expect(formatPrice(999999999)).toBe('$999.999.999');
    });
  });

  describe('currency (backwards compatibility)', () => {
    it('works the same as formatPrice', () => {
      const price = 1500000;
      expect(currency(price)).toBe(formatPrice(price));
    });

    it('handles undefined', () => {
      expect(currency()).toBe(formatPrice());
    });
  });

  describe('fakeDelay', () => {
    it('resolves after default delay', async () => {
      const start = Date.now();
      await fakeDelay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(95); // Allow for some timing variance
    });

    it('resolves after specified delay', async () => {
      const start = Date.now();
      await fakeDelay(50);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(45);
    });
  });
});
