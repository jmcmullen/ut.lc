import { defineConfig } from "vitest/config";

/**
 * Create a Vitest workspace configuration with browser and node environments
 * @param {Object} options - Configuration options
 * @param {string[]} options.browserIncludes - Glob patterns for browser tests
 * @param {string[]} options.nodeIncludes - Glob patterns for node tests
 * @param {string} options.browserSetupFile - Path to browser setup file
 * @param {string} options.nodeSetupFile - Path to node setup file
 * @param {import('vite').Plugin[]} options.plugins - Vite plugins to use
 * @returns {import('vitest/config').UserConfig}
 */
export function createWorkspaceConfig({
  browserIncludes = [
    "src/components/**/*.test.{ts,tsx}",
    "src/contexts/**/*.test.{ts,tsx}",
  ],
  nodeIncludes = ["src/api/**/*.test.{ts,tsx}"],
  browserSetupFile = "./vitest.setup.tsx",
  nodeSetupFile = "./vitest.setup.node.ts",
  plugins = [],
}) {
  return defineConfig({
    test: {
      workspace: [
        // Browser environment for component tests
        {
          plugins,
          test: {
            name: "browser",
            globals: true,
            css: true,
            environment: "jsdom",
            setupFiles: [browserSetupFile],
            include: browserIncludes,
          },
        },
        // Node environment for API tests
        {
          plugins,
          test: {
            name: "node",
            globals: true,
            environment: "node",
            setupFiles: [nodeSetupFile],
            include: nodeIncludes,
          },
        },
      ],
    },
  });
}
