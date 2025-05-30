import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import pluginRouter from "@tanstack/eslint-plugin-router";
import * as reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginRouter.configs["flat/recommended"],
  reactHooks.configs.recommended,
  react.configs["recommended-type-checked"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "react-hooks/react-compiler": "warn",
      "@typescript-eslint/no-namespace": "off",
    },
  },
];
