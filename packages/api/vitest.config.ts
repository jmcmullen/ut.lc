import viteTsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      // Node environment for API tests
      {
        plugins: [viteTsconfigPaths()],
        test: {
          name: "api",
          globals: true,
          environment: "node",
          setupFiles: ["./vitest.setup.node.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
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
