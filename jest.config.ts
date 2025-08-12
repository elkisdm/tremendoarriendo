import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@data/(.*)$': '<rootDir>/data/$1',
    '^@schemas/(.*)$': '<rootDir>/schemas/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
    '^lucide-react$': '<rootDir>/tests/__mocks__/lucide-react.tsx',
    '^@lib/whatsapp$': '<rootDir>/tests/__mocks__/whatsapp.ts',
    '^@lib/analytics$': '<rootDir>/tests/__mocks__/analytics.ts',
    '^server-only$': '<rootDir>/tests/__mocks__/server-only.ts',
    '^zustand$': '<rootDir>/tests/__mocks__/zustand.ts',
    '^framer-motion$': '<rootDir>/tests/__mocks__/framer-motion.tsx',
    '^@heroicons/react/24/outline$': '<rootDir>/tests/__mocks__/heroicons.tsx',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.jest.json', isolatedModules: true },
    ],
  },
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
};

export default config;


