import baseConfig, { restrictEnvAccess } from "@utlc/eslint-config/base";
import tanstackConfig from "@utlc/eslint-config/tanstack-start";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", ".vinxi", ".wrangler", ".vercel", ".netlify", ".output", "build/"],
  },
  ...baseConfig,
  ...tanstackConfig,
  ...restrictEnvAccess,
);