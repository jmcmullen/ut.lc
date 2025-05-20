export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
          parser: {
            syntax: "typescript",
            tsx: true,
            decorators: false,
            dynamicImport: false,
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "^~/(.*)$": "<rootDir>/src/$1",
    "\\.svg$": "<rootDir>/src/__mocks__/svgMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
