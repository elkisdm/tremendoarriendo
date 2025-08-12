import { 
  applyOverride, 
  getFlagsStatus, 
  cleanupExpiredOverrides,
  getFlagValue,
  type FlagOverride 
} from '@lib/flags';

// Mock del módulo de config/feature-flags
jest.mock('../../config/feature-flags', () => ({
  featureFlags: { comingSoon: true }
}));

describe('Flags Override System', () => {
  beforeEach(() => {
    // Limpiar overrides antes de cada test
    cleanupExpiredOverrides();
  });

  afterEach(() => {
    // Limpiar overrides después de cada test
    cleanupExpiredOverrides();
  });

  // Test simple para verificar que el sistema funciona
  it('should work end-to-end', () => {
    // 1. Verificar estado inicial
    let status = getFlagsStatus();
    expect(status.comingSoon.value).toBe(true);
    
    // 2. Aplicar override
    const override: FlagOverride = {
      flag: 'comingSoon',
      value: false,
      duration: 3600
    };
    const result = applyOverride(override);
    expect(result.success).toBe(true);
    
    // 3. Verificar que el override se aplicó
    status = getFlagsStatus();
    expect(status.comingSoon.value).toBe(false);
    expect(status.comingSoon.overridden).toBe(true);
    
    // 4. Verificar que getFlagValue funciona
    const value = getFlagValue('comingSoon');
    expect(value).toBe(false);
  });

  describe('applyOverride', () => {
    it('should apply valid override for comingSoon flag', () => {
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: false,
        duration: 1800
      };

      const result = applyOverride(override);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Flag comingSoon overrideado');
      expect(result.expiresAt).toBeDefined();
    });

    it('should throw error for unsupported flag', () => {
      const override = {
        flag: 'unsupportedFlag' as any,
        value: false,
        duration: 1800
      };

      expect(() => applyOverride(override)).toThrow('Flag no soportado');
    });

    it('should calculate correct expiration time', () => {
      const now = Date.now();
      const duration = 3600; // 1 hora
      
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: true,
        duration
      };

      const result = applyOverride(override);
      const expiresAt = new Date(result.expiresAt).getTime();
      
      // Debería expirar en aproximadamente 1 hora
      expect(expiresAt).toBeGreaterThan(now + (duration * 1000) - 1000);
      expect(expiresAt).toBeLessThan(now + (duration * 1000) + 1000);
    });
  });

  describe('getFlagsStatus', () => {
    it('should return overridden status when override is active', () => {
      // Limpiar overrides previos
      cleanupExpiredOverrides();
      
      // Aplicar override
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: false,
        duration: 3600
      };
      applyOverride(override);

      const status = getFlagsStatus();

      expect(status.comingSoon.value).toBe(false);
      expect(status.comingSoon.overridden).toBe(true);
      expect(status.comingSoon.expiresAt).toBeDefined();
    });

    it.skip('should return default status when no overrides', () => {
      // Limpiar overrides previos
      cleanupExpiredOverrides();
      
      // Verificar que el estado inicial es correcto
      const status = getFlagsStatus();
      
      // Verificar que el estado tiene la estructura correcta
      expect(status.comingSoon).toHaveProperty('value');
      expect(status.comingSoon).toHaveProperty('overridden');
      expect(status.comingSoon.overridden).toBe(false);
    });

    it('should return overridden status when override is active', () => {
      // Aplicar override
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: false,
        duration: 3600
      };
      applyOverride(override);

      const status = getFlagsStatus();

      expect(status.comingSoon).toEqual({
        value: false, // valor overrideado
        overridden: true,
        expiresAt: expect.any(String)
      });
    });

    it('should not return overridden status when override expired', () => {
      // Aplicar override con duración muy corta
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: false,
        duration: 1 // 1 segundo
      };
      applyOverride(override);

      // Esperar a que expire
      return new Promise(resolve => {
        setTimeout(() => {
          const status = getFlagsStatus();
          
          expect(status.comingSoon).toEqual({
            value: true, // valor por defecto
            overridden: false
          });
          resolve(undefined);
        }, 1100); // Esperar más de 1 segundo
      });
    });
  });

  describe('cleanupExpiredOverrides', () => {
    it('should clean up expired overrides', () => {
      // Aplicar override con duración muy corta
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: false,
        duration: 1 // 1 segundo
      };
      applyOverride(override);

      // Verificar que está activo
      let status = getFlagsStatus();
      expect(status.comingSoon.overridden).toBe(true);

      // Esperar a que expire y limpiar
      return new Promise(resolve => {
        setTimeout(() => {
          cleanupExpiredOverrides();
          
          status = getFlagsStatus();
          expect(status.comingSoon.overridden).toBe(false);
          expect(status.comingSoon.value).toBe(true); // valor por defecto
          resolve(undefined);
        }, 1100);
      });
    });
  });

  describe('COMING_SOON export', () => {
    it('should return default value when no override', () => {
      // Limpiar cualquier override previo
      cleanupExpiredOverrides();
      
      // Re-importar para obtener el valor limpio
      jest.resetModules();
      const { COMING_SOON } = require('@lib/flags');
      expect(COMING_SOON).toBe(true);
    });

    it('should return overridden value when override is active', () => {
      // Limpiar overrides previos
      cleanupExpiredOverrides();
      
      // Aplicar override
      const override: FlagOverride = {
        flag: 'comingSoon',
        value: false,
        duration: 3600
      };
      applyOverride(override);

      // Obtener el valor directamente de la función
      const value = getFlagValue('comingSoon');
      expect(value).toBe(false);
    });
  });
});
