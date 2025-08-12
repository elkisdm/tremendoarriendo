import { COMING_SOON } from '../../lib/flags';

// Mock del archivo TypeScript
jest.mock('../../config/feature-flags', () => ({
  featureFlags: {
    comingSoon: true
  }
}));

describe('Flags System', () => {
  it('debería usar el valor del archivo TypeScript', () => {
    expect(COMING_SOON).toBe(true);
  });

  it('debería convertir correctamente a boolean', () => {
    // El valor viene del mock que tiene comingSoon: true
    expect(typeof COMING_SOON).toBe('boolean');
    expect(COMING_SOON).toBe(true);
  });
});

// Test adicional con mock dinámico
describe('Flags System - Dynamic TypeScript', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('debería usar comingSoon: false del archivo TypeScript', () => {
    // Mock temporal con comingSoon: false
    jest.doMock('../../config/feature-flags', () => ({
      featureFlags: {
        comingSoon: false
      }
    }));
    
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(false);
  });

  it('debería usar comingSoon: true del archivo TypeScript', () => {
    // Mock temporal con comingSoon: true
    jest.doMock('../../config/feature-flags', () => ({
      featureFlags: {
        comingSoon: true
      }
    }));
    
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(true);
  });
});
