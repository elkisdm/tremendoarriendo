// Mock configurable de flags para tests
const mockFlags = {
  CARD_V2: false,
  VIRTUAL_GRID: false,
  PAGINATION: false,
  COMING_SOON: false,
};

// Función para configurar flags en tests
export function setMockFlag(flag: keyof typeof mockFlags, value: boolean) {
  mockFlags[flag] = value;
}

// Función para resetear flags
export function resetMockFlags() {
  mockFlags.CARD_V2 = false;
  mockFlags.VIRTUAL_GRID = false;
  mockFlags.PAGINATION = false;
  mockFlags.COMING_SOON = false;
}

// Exportar flags como getters configurables
Object.defineProperty(exports, 'CARD_V2', {
  get: () => mockFlags.CARD_V2,
  configurable: true,
});

Object.defineProperty(exports, 'VIRTUAL_GRID', {
  get: () => mockFlags.VIRTUAL_GRID,
  configurable: true,
});

Object.defineProperty(exports, 'PAGINATION', {
  get: () => mockFlags.PAGINATION,
  configurable: true,
});

Object.defineProperty(exports, 'COMING_SOON', {
  get: () => mockFlags.COMING_SOON,
  configurable: true,
});

// Exportar funciones de utilidad
export { getFlagValue, applyOverride, getFlagsStatus, cleanupExpiredOverrides } from '../../lib/flags';
