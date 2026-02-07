import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules",
        "dist",
        "src/generated/**",
        "src/__tests__/**",
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/**/test-*.ts",
      ],
    },
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
