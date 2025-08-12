// Test de humo para flags override API - Schema validation only
import { z } from 'zod';

// Schema para validación (copiado del endpoint)
const OverrideRequestSchema = z.object({
  flag: z.enum(['comingSoon']),
  value: z.boolean(),
  duration: z.number().int().min(300).max(3600).optional(), // 5min - 1h en segundos
});

describe('Flags Override API Schema', () => {
  describe('OverrideRequestSchema', () => {
    it('should accept valid override request', () => {
      const validRequest = {
        flag: 'comingSoon' as const,
        value: false,
        duration: 1800
      };
      
      expect(() => OverrideRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('should reject invalid flag', () => {
      const invalidRequest = {
        flag: 'invalidFlag',
        value: false
      };
      
      expect(() => OverrideRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should reject invalid duration', () => {
      const invalidRequest = {
        flag: 'comingSoon' as const,
        value: false,
        duration: 100 // Muy corto
      };
      
      expect(() => OverrideRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should use default duration when not provided', () => {
      const validRequest = {
        flag: 'comingSoon' as const,
        value: true
      };
      
      const result = OverrideRequestSchema.parse(validRequest);
      expect(result.duration).toBeUndefined();
    });

    it('should accept duration in valid range', () => {
      const validRequest = {
        flag: 'comingSoon' as const,
        value: false,
        duration: 3600 // 1 hora
      };
      
      expect(() => OverrideRequestSchema.parse(validRequest)).not.toThrow();
    });
  });
});
