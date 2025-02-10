/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
  transform: {
    '\\.[jt]sx?$': ['ts-jest', { useESM: true }]
  },
  // globals: {
  //   'ts-jest': {
  //     useESM: true
  //   }
  // },
  moduleNameMapper: {
    '(.+)\\.js': '$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  
};

module.exports = config;
