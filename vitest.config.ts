import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/coverage/**"],
    },
  },
  test: {
    clearMocks: true,
    includeSource: ["src/**/*.ts"],
    environment: "jsdom",
    coverage: {
      all: true,
      include: ["src/lib"],
      exclude: [
        "src/lib/tests",
        "src/lib/index.ts",
        "src/lib/types/*.ts",
        "src/lib/utils/testing.ts",
      ],
      lines: 95,
      functions: 95,
      branches: 95,
      statements: 95,
    },
  },
});
