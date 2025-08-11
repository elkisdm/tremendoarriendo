import { COMING_SOON } from '../../lib/flags';

// Mock del archivo JSON
jest.mock('../../config/feature-flags.json', () => ({
  comingSoon: true
}));

describe('Flags System', () => {
  it('debería usar el valor del archivo JSON', () => {
    expect(COMING_SOON).toBe(true);
  });

  it('debería convertir correctamente a boolean', () => {
    // El valor viene del mock que tiene comingSoon: true
    expect(typeof COMING_SOON).toBe('boolean');
    expect(COMING_SOON).toBe(true);
  });
});

// Test adicional con mock dinámico
describe('Flags System - Dynamic JSON', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('debería usar comingSoon: false del archivo JSON', () => {
    // Mock temporal con comingSoon: false
    jest.doMock('../../config/feature-flags.json', () => ({
      comingSoon: false
    }));
    
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(false);
  });

  it('debería usar comingSoon: true del archivo JSON', () => {
    // Mock temporal con comingSoon: true
    jest.doMock('../../config/feature-flags.json', () => ({
      comingSoon: true
    }));
    
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(true);
  });
});
