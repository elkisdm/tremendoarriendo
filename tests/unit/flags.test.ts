import { COMING_SOON } from '../../lib/flags';

// Mock del archivo JSON
jest.mock('../../config/feature-flags.json', () => ({
  comingSoon: true
}));

describe('Flags System', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('debería usar el valor del archivo JSON cuando no hay variable de entorno', () => {
    delete process.env.COMING_SOON;
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(true);
  });

  it('debería usar COMING_SOON=true cuando la variable de entorno está en true', () => {
    process.env.COMING_SOON = 'true';
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(true);
  });

  it('debería usar COMING_SOON=false cuando la variable de entorno está en false', () => {
    process.env.COMING_SOON = 'false';
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(false);
  });

  it('debería priorizar la variable de entorno sobre el archivo JSON', () => {
    process.env.COMING_SOON = 'false';
    const { COMING_SOON } = require('../../lib/flags');
    expect(COMING_SOON).toBe(false);
  });
});
