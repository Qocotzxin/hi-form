import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "MyLib",
      fileName: "formula",
    },
  },
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
