/**
 * Vitest Test Setup
 *
 * This file runs before each test file to configure the testing environment.
 * It sets up:
 * - Extended Jest DOM matchers for asserting on DOM elements
 * - Cleanup after each test to prevent test pollution
 * - Any global mocks needed across all tests
 *
 * @see https://testing-library.com/docs/react-testing-library/setup
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/**
 * Automatically clean up after each test.
 *
 * This unmounts React components rendered during the test,
 * preventing memory leaks and ensuring tests don't affect each other.
 */
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * Mock window.matchMedia for components that use media queries.
 * jsdom doesn't implement this by default.
 *
 * @see https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 * @see https://kitemetric.com/blogs/remix-testing-vitest-react-testing-library-and-typescript
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
