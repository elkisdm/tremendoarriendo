import '@testing-library/jest-dom';

// Silence Next.js router warnings if any component uses it indirectly
// and provide generic mocks where helpful.
window.scrollTo = window.scrollTo || (() => {});

// Polyfill fetch for jsdom if not present
if (!(global as any).fetch) {
  (global as any).fetch = jest.fn();
}

// Mock matchMedia for components that use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock WhatsApp module globally
jest.mock('@lib/whatsapp', () => ({
  buildWhatsAppUrl: jest.fn((params: any) => {
    const baseUrl = 'https://wa.me/1234567890';
    const message = params?.message || 'Hola, me interesa';
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  })
}));


