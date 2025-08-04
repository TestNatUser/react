/** @type {import("jest").Config} **/
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/__tests__/polyfills.ts"],
  extensionsToTreatAsEsm: [".tsx", ".ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      useESM: true,
      tsconfig: "tsconfig.test.json",
    }],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "jest-transform-stub",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testMatch: [
    "<rootDir>/src/**/*.test.(ts|tsx|js|jsx)",
    "<rootDir>/src/**/*.spec.(ts|tsx|js|jsx)"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/setup.ts",
    "<rootDir>/src/__tests__/test-utils.tsx",
    "<rootDir>/src/__tests__/mocks/"
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
      functions: 50,
      lines: 50
    }
  }
}; 