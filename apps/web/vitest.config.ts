import viteTsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      // Browser environment for component tests
      {
        plugins: [viteTsconfigPaths()],
        test: {
          name: "browser",
          globals: true,
          css: true,
          environment: "jsdom",
          setupFiles: ["./vitest.setup.tsx"],
          include: [
            "src/components/**/*.test.{ts,tsx}",
            "src/contexts/**/*.test.{ts,tsx}",
            "src/utils/**/*.test.{ts,tsx}",
            "src/actions/**/*.test.{ts,tsx}",
          ],
        },
        resolve: {
          alias: {
            "~/": new URL("./src/", import.meta.url).pathname,
          },
        },
      },
      // Node environment for API tests
      {
        plugins: [viteTsconfigPaths()],
        test: {
          name: "node",
          globals: true,
          environment: "node",
          setupFiles: ["./vitest.setup.node.ts"],
          include: [
            "src/api/**/*.test.{ts,tsx}",
            "src/serverActions/**/*.test.{ts,tsx}",
          ],
        },
        resolve: {
          alias: {
            "~/": new URL("./src/", import.meta.url).pathname,
          },
        },
      },
    ],
  },
});
