/**
 * Vitest Setup File
 *
 * This file runs before all tests. Use it to:
 * - Set up global test utilities
 * - Configure environment variables for testing
 * - Set up database connections for integration tests
 * - Add global mocks
 */

import path from "path";
import { fileURLToPath } from "url";

import { config } from "dotenv";
import { beforeAll, afterAll, afterEach, vi } from "vitest";

// Load environment variables from root .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../.env") });

beforeAll(() => {
  // Global setup before all tests
  console.log("[Test] Starting test suite...");
});

afterAll(() => {
  // Global cleanup after all tests
  console.log("[Test] Test suite complete.");
});

afterEach(() => {
  vi.clearAllMocks();
});
