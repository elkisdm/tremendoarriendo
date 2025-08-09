import '@testing-library/jest-dom';

// Silence Next.js router warnings if any component uses it indirectly
// and provide generic mocks where helpful.
window.scrollTo = window.scrollTo || (() => {});

// Polyfill fetch for jsdom if not present
if (!(global as any).fetch) {
  (global as any).fetch = jest.fn();
}


