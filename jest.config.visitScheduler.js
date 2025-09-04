const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testEnvironment: 'jsdom',
    testMatch: [
        '<rootDir>/tests/**/*.test.{ts,tsx}',
        '<rootDir>/tests/**/*.spec.{ts,tsx}'
    ],
    collectCoverageFrom: [
        'components/flow/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'app/api/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        './components/flow/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
        './hooks/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@components/(.*)$': '<rootDir>/components/$1',
        '^@hooks/(.*)$': '<rootDir>/hooks/$1',
        '^@lib/(.*)$': '<rootDir>/lib/$1',
        '^@types/(.*)$': '<rootDir>/types/$1',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/tests/e2e/',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    verbose: true,
    testTimeout: 10000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
