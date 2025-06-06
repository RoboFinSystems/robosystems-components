/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/packages/auth-core',
    '<rootDir>/packages/auth-components',
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.test.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
}