import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

export default jestConfig;
