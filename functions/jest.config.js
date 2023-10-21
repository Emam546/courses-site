/* eslint-disable quotes */
/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.+(test|spec).+(ts|tsx|js)"],
  testEnvironment: "node",
  preset: "ts-jest/presets/js-with-ts",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src",
  },
};
