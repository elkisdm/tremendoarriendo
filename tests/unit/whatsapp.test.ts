// Mock process.env
const originalEnv = process.env;

// Unmock the whatsapp module for this test
jest.unmock('@lib/whatsapp');

let buildWhatsAppUrl: any;

beforeEach(async () => {
  jest.resetModules();
  process.env = { ...originalEnv };
  const module = await import('@lib/whatsapp');
  buildWhatsAppUrl = module.buildWhatsAppUrl;
});

afterAll(() => {
  process.env = originalEnv;
});

describe('buildWhatsAppUrl', () => {
  it('should return NEXT_PUBLIC_WA_URL when it exists (priority 1)', () => {
    process.env.NEXT_PUBLIC_WA_URL = 'https://wa.me/123456789?text=Hola';
    
    const result = buildWhatsAppUrl();
    
    expect(result).toBe('https://wa.me/123456789?text=Hola');
  });

  it('should build URL from WA_PHONE_E164 and WA_MESSAGE when NEXT_PUBLIC_WA_URL is not set (priority 2)', () => {
    process.env.NEXT_PUBLIC_WA_URL = undefined;
    process.env.WA_PHONE_E164 = '+56912345678';
    process.env.WA_MESSAGE = 'Hola, me interesa';
    
    const result = buildWhatsAppUrl();
    
    expect(result).toBe('https://wa.me/+56912345678?text=Hola%2C%20me%20interesa');
  });

  it('should use default message "Hola" when WA_MESSAGE is not set', () => {
    process.env.NEXT_PUBLIC_WA_URL = undefined;
    process.env.WA_PHONE_E164 = '+56912345678';
    process.env.WA_MESSAGE = undefined;
    
    const result = buildWhatsAppUrl();
    
    expect(result).toBe('https://wa.me/+56912345678?text=Hola');
  });

  it('should include URL in message when provided', () => {
    process.env.NEXT_PUBLIC_WA_URL = undefined;
    process.env.WA_PHONE_E164 = '+56912345678';
    process.env.WA_MESSAGE = 'Hola';
    
    const result = buildWhatsAppUrl({
      url: 'https://hommie.cl/coming-soon'
    });
    
    expect(result).toBe('https://wa.me/+56912345678?text=Hola%20https%3A%2F%2Fhommie.cl%2Fcoming-soon');
  });

  it('should prioritize opts.phoneE164 over WA_PHONE_E164', () => {
    process.env.NEXT_PUBLIC_WA_URL = undefined;
    process.env.WA_PHONE_E164 = '+56912345678';
    process.env.WA_MESSAGE = 'Hola';
    
    const result = buildWhatsAppUrl({
      phoneE164: '+56987654321',
      message: 'Custom message'
    });
    
    expect(result).toBe('https://wa.me/+56987654321?text=Custom%20message');
  });

  it('should return null when no WhatsApp configuration is available (priority 3)', () => {
    process.env.NEXT_PUBLIC_WA_URL = undefined;
    process.env.WA_PHONE_E164 = undefined;
    process.env.WA_MESSAGE = undefined;
    
    const result = buildWhatsAppUrl();
    
    expect(result).toBeNull();
  });

  it('should return null when only WA_MESSAGE is set but no phone', () => {
    process.env.NEXT_PUBLIC_WA_URL = undefined;
    process.env.WA_PHONE_E164 = undefined;
    process.env.WA_MESSAGE = 'Hola';
    
    const result = buildWhatsAppUrl();
    
    expect(result).toBeNull();
  });
});


