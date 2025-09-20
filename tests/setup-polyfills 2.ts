// Polyfills para Jest y MSW
import { TextEncoder, TextDecoder } from 'util';

// Polyfill para TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Polyfill para crypto si es necesario
if (!global.crypto) {
  global.crypto = require('crypto').webcrypto;
}

// Polyfill para fetch si es necesario
if (!global.fetch) {
  // En Node.js 18+, fetch está disponible globalmente
  if (typeof globalThis.fetch === 'undefined') {
    const fetch = require('node-fetch');
    global.fetch = fetch;
  } else {
    global.fetch = globalThis.fetch;
  }
}
