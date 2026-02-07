/**
 * Config Module Tests
 *
 * Tests for configuration loading.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { config } from "../../config/config.js";

describe("Config Module", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  describe("config object", () => {
    it("should have server configuration", () => {
      expect(config.server).toBeDefined();
      expect(typeof config.server.port).toBe("number");
      expect(typeof config.server.nodeEnv).toBe("string");
    });

    it("should have clientUrl configuration", () => {
      expect(config.server.clientUrl).toBeDefined();
      expect(typeof config.server.clientUrl).toBe("string");
      expect(config.server.clientUrl).toContain("http://localhost:");
    });
  });

  describe("environment helpers", () => {
    it("should have correct isDev/isProd flags", () => {
      expect(typeof config.server.isDev).toBe("boolean");
      expect(typeof config.server.isProd).toBe("boolean");
    });

    it("should have valid port number", () => {
      expect(config.server.port).toBeGreaterThan(0);
      expect(config.server.port).toBeLessThan(65536);
    });
  });

  describe("envNumber helper (via server config)", () => {
    it("should parse valid number string", async () => {
      process.env.PORT = "4000";
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.port).toBe(4000);
    });

    it("should return default for invalid number string", async () => {
      process.env.PORT = "not-a-number";
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      // Should fall back to default (3000)
      expect(freshConfig.server.port).toBe(3000);
    });

    it("should use default requestTimeout when REQUEST_TIMEOUT is not set", async () => {
      // REQUEST_TIMEOUT is not in .env, so this tests the undefined branch
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.requestTimeout).toBe(30000);
    });

    it("should use custom REQUEST_TIMEOUT when set", async () => {
      process.env.REQUEST_TIMEOUT = "5000";
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.requestTimeout).toBe(5000);
    });
  });

  describe("env helper (via server config)", () => {
    it("should use custom VITE_DEV_PORT when set", async () => {
      process.env.VITE_DEV_PORT = "5200";
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.clientUrl).toContain("5200");
    });

    it("should use custom NODE_ENV when set", async () => {
      process.env.NODE_ENV = "production";
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.nodeEnv).toBe("production");
    });

    it("should use default logLevel when LOG_LEVEL is not set", async () => {
      // LOG_LEVEL is not in .env, so this tests the default branch
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.logLevel).toBe("info");
    });

    it("should use custom LOG_LEVEL when set", async () => {
      process.env.LOG_LEVEL = "debug";
      vi.resetModules();

      const { config: freshConfig } = await import("../../config/config.js");
      expect(freshConfig.server.logLevel).toBe("debug");
    });
  });
});
