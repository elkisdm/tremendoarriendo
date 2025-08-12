// Test de humo para flags override API

// Mock Next.js request/response
const mockRequest = (body: any) => ({
  json: async () => body,
  headers: {
    get: (name: string) => {
      if (name === 'x-forwarded-for') return '127.0.0.1';
      if (name === 'x-real-ip') return '127.0.0.1';
      return null;
    }
  }
});

const mockResponse = () => {
  const res: any = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

// Importar las funciones del endpoint
let POST: any, GET: any;

beforeAll(async () => {
  // Importar dinámicamente para evitar problemas con Next.js
  try {
    const module = await import('../../app/api/flags/override/route');
    POST = module.POST;
    GET = module.GET;
  } catch (error) {
    console.warn('No se pudo importar el módulo de flags override:', error);
  }
});

describe('Flags Override API', () => {
  describe('POST /api/flags/override', () => {
    it('should accept valid override request', async () => {
      const req = mockRequest({
        flag: 'comingSoon',
        value: false,
        duration: 1800
      });
      const res = mockResponse();

      await POST(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('Flag comingSoon overrideado')
        })
      );
    });

    it('should reject invalid flag', async () => {
      const req = mockRequest({
        flag: 'invalidFlag',
        value: false
      });
      const res = mockResponse();

      await POST(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Datos inválidos'
        })
      );
    });

    it('should reject invalid duration', async () => {
      const req = mockRequest({
        flag: 'comingSoon',
        value: false,
        duration: 100 // Muy corto
      });
      const res = mockResponse();

      await POST(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Datos inválidos'
        })
      );
    });

    it('should use default duration when not provided', async () => {
      const req = mockRequest({
        flag: 'comingSoon',
        value: true
      });
      const res = mockResponse();

      await POST(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          expiresAt: expect.any(String)
        })
      );
    });
  });

  describe('GET /api/flags/override', () => {
    it('should return current flags status', async () => {
      const res = mockResponse();

      await GET(res as any);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          flags: expect.objectContaining({
            comingSoon: expect.any(Boolean)
          })
        })
      );
    });
  });
});
