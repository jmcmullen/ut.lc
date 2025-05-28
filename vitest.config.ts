import viteTsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteTsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
