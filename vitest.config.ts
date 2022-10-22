import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    includeSource: ["src/**/*.ts"],
    environment: "jsdom",
    coverage: {
      exclude: [
        "src/lib/types/*.ts",
        "src/lib/utils/testing.ts",
        "src/lib/tests",
      ],
      lines: 95,
      functions: 95,
      branches: 95,
      statements: 95,
    },
  },
});
