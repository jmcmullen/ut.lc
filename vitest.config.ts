import viteTsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteTsconfigPaths()],
  test: {
    globals: true,
    css: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
    environmentMatchGlobs: [
      // Use node environment for API tests
      ["src/api/**/*.test.ts", "node"],
    ],
  },
  resolve: {
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
  },
});