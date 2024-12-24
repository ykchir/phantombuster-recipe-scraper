module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^phantombuster$": "<rootDir>/__mocks__/phantombuster.ts",
  },
  coveragePathIgnorePatterns: ["<rootDir>/src/infrastructure/PuppeteerRecipeRepository.ts"],
};
