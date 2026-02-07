/**
 * Vitest Configuration
 *
 * Vitest is a fast unit testing framework built on Vite.
 * It provides Jest-compatible APIs with native ESM support and TypeScript.
 *
 * Key features:
 * - Uses the same config as Vite (plugins, resolve aliases)
 * - Watch mode with instant re-runs
 * - Built-in coverage reporting
 * - Compatible with Jest matchers via @testing-library/jest-dom
 *
 * @see https://vitest.dev/config/
 */

import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Same path alias as vite.config.ts
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    // -------------------------------------------------------------------------
    // ENVIRONMENT
    // -------------------------------------------------------------------------

    /**
     * Use jsdom to simulate a browser environment.
     * This allows testing React components that use DOM APIs.
     * Alternative: 'happy-dom' (faster but less complete)
     */
    environment: "jsdom",

    /**
     * Global test setup file.
     * Runs before each test file to set up testing utilities.
     */
    setupFiles: ["./src/__tests__/setup.ts"],

    /**
     * Make test functions (describe, it, expect) available globally.
     * Without this, you'd need to import them in every test file.
     */
    globals: true,

    // -------------------------------------------------------------------------
    // COVERAGE
    // -------------------------------------------------------------------------

    coverage: {
      /**
       * Coverage provider - v8 is faster than istanbul.
       */
      provider: "v8",

      /**
       * Generate coverage reports in these formats:
       * - text: Console output
       * - json: Machine-readable for CI
       * - html: Visual report you can open in browser
       */
      reporter: ["text", "json", "html"],

      /**
       * Files to include in coverage.
       * Excludes test files, type definitions, and config files.
       */
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/__tests__/**", "src/**/*.d.ts", "src/main.tsx", "src/vite-env.d.ts"],
    },

    // -------------------------------------------------------------------------
    // TEST MATCHING
    // -------------------------------------------------------------------------

    /**
     * Patterns to find test files.
     * Matches: *.test.ts, *.test.tsx, *.spec.ts, *.spec.tsx
     */
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    /**
     * Files/directories to exclude from testing.
     */
    exclude: ["node_modules", "dist"],
  },
});
