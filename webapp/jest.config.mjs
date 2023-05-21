import nextJest from 'next/jest.js';
 
const createJestConfig = nextJest({
  dir: './',
});
 
/** @type {import('jest').Config} */
const config = {
  automock: false,
  setupFiles: [
    '<rootDir>/setupJest.mjs'
  ],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src/app/$1',
    '^@components(.*)': '<rootDir>/src/components/$1',
    '^@lib(.*)': '<rootDir>/src/lib/$1',
    '^@styles(.*)': '<rootDir>/src/styles/$1*'
  }
};

export default createJestConfig(config);