/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
 
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  coverageDirectory: "coverage",
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$',
    '\\.css$',
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/mocks/styleMock.js"
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};

module.exports = config;
