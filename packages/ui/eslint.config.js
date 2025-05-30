import baseConfig from "@utlc/eslint-config/base";
import reactConfig from "@utlc/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
