import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/dist/**",
        "**/*.config.*",
        "**/tests/**",
        "**/__tests__/**",
        "**/test/**",
        "**/*.test.*",
        "**/*.spec.*",
        "**/setup.*",
        "**/vitest.setup.*",
      ],
    },
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});