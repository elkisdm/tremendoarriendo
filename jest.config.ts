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


