import { createWorkspaceConfig } from "@utlc/vitest-config/workspace";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default createWorkspaceConfig({
  browserIncludes: [
    "src/components/**/*.test.{ts,tsx}",
    "src/contexts/**/*.test.{ts,tsx}",
    "src/utils/**/*.test.{ts,tsx}",
    "src/actions/**/*.test.{ts,tsx}",
  ],
  nodeIncludes: ["src/api/**/*.test.{ts,tsx}", "src/serverActions/**/*.test.{ts,tsx}"],
  browserSetupFile: "./vitest.setup.tsx",
  nodeSetupFile: "./vitest.setup.node.ts",
  plugins: [viteTsconfigPaths()],
});