import { createSupabaseClient } from '@lib/supabase.mock';

// Mock process.env
const originalEnv = process.env;

describe('Supabase Mock - Production Safety', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // Helper para modificar NODE_ENV de forma segura
  const setNodeEnv = (env: string) => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: env,
      writable: true,
      configurable: true
    });
  };

  describe('createSupabaseClient', () => {
    it('should throw server_misconfigured error in production when env vars are missing', () => {
      // Simular entorno de producción sin variables de entorno
      setNodeEnv('production');
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(() => {
        createSupabaseClient();
      }).toThrow('server_misconfigured');
    });

    it('should use real client in production when env vars are present', () => {
      // Simular entorno de producción con variables de entorno
      setNodeEnv('production');
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const client = createSupabaseClient();
      
      // Verificar que no es el mock (el mock no tiene la propiedad auth)
      expect(client).toHaveProperty('auth');
      expect(client).toHaveProperty('from');
    });

    it('should use mock in development when env vars are missing', () => {
      // Simular entorno de desarrollo sin variables de entorno
      setNodeEnv('development');
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const client = createSupabaseClient();
      
      // Verificar que es el mock (el mock no tiene la propiedad auth)
      expect(client).not.toHaveProperty('auth');
      expect(client).toHaveProperty('from');
    });

    it('should use real client in development when env vars are present', () => {
      // Simular entorno de desarrollo con variables de entorno
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const client = createSupabaseClient();
      
      // Verificar que no es el mock
      expect(client).toHaveProperty('auth');
      expect(client).toHaveProperty('from');
    });
  });
});
