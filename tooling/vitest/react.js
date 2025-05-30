import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { mergeConfig } from "vitest/config";

import baseConfig from "./base.js";

export default mergeConfig(baseConfig, {
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
    tsconfigPaths(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.tsx"],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    globals: true,
  },
  resolve: {
    alias: {
      // Mock CSS and asset imports for tests
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
  },
});