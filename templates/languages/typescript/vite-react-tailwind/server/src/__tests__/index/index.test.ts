/**
 * Index (Server Entry Point) Tests
 *
 * Tests for the main server entry point.
 * Tests server initialization, startup, and graceful shutdown.
 */

import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from "vitest";

describe("Server Entry Point", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("module exports", () => {
    it("should export app instance", async () => {
      const { app } = await import("../../index.js");
      expect(app).toBeDefined();
    });

    it("should export httpServer instance", async () => {
      const { httpServer } = await import("../../index.js");
      expect(httpServer).toBeDefined();
    });

    it("should export gracefulShutdown function", async () => {
      const { gracefulShutdown } = await import("../../index.js");
      expect(gracefulShutdown).toBeDefined();
      expect(typeof gracefulShutdown).toBe("function");
    });

    it("should export startServer function", async () => {
      const { startServer } = await import("../../index.js");
      expect(startServer).toBeDefined();
      expect(typeof startServer).toBe("function");
    });
  });

  describe("gracefulShutdown", () => {
    it("should log shutdown message and close server", async () => {
      const { gracefulShutdown, httpServer } = await import("../../index.js");

      const closeSpy = vi.spyOn(httpServer, "close").mockImplementation(
        /* eslint-disable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
        (callback?: any) => {
          if (typeof callback === "function") callback();
          return httpServer;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
      );

      gracefulShutdown("SIGTERM");

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining("SIGTERM received"));
      expect(console.log).toHaveBeenCalledWith("[Server] HTTP server closed");
      expect(closeSpy).toHaveBeenCalled();
    });

    it("should handle SIGINT signal", async () => {
      const { gracefulShutdown, httpServer } = await import("../../index.js");

      const closeSpy = vi.spyOn(httpServer, "close").mockImplementation(
        /* eslint-disable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
        (callback?: any) => {
          if (typeof callback === "function") callback();
          return httpServer;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
      );

      gracefulShutdown("SIGINT");

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining("SIGINT received"));
      expect(console.log).toHaveBeenCalledWith("[Server] HTTP server closed");
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("startServer", () => {
    afterAll(async () => {
      // Clean up - close the server if it was started
      const { httpServer } = await import("../../index.js");
      httpServer.close();
    });

    it("should start the HTTP server on configured port", async () => {
      const { startServer, httpServer } = await import("../../index.js");

      const listenSpy = vi.spyOn(httpServer, "listen").mockImplementation(
        /* eslint-disable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
        (...args: any[]) => {
          // Call the callback if provided (2nd argument)
          const callback = args[1];
          if (typeof callback === "function") callback();
          return httpServer;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
      );

      startServer();

      expect(listenSpy).toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining("EXPRESS SERVER"));
    });

    it("should register SIGTERM signal handler", async () => {
      const { startServer, httpServer } = await import("../../index.js");

      const processOnSpy = vi.spyOn(process, "on");
      const listenSpy = vi.spyOn(httpServer, "listen").mockImplementation(() => httpServer);

      startServer();

      expect(processOnSpy).toHaveBeenCalledWith("SIGTERM", expect.any(Function));

      // Get the registered handler and call it to verify it calls gracefulShutdown
      const sigtermCall = processOnSpy.mock.calls.find((call) => call[0] === "SIGTERM");
      expect(sigtermCall).toBeDefined();

      // Mock httpServer.close for the handler test
      const closeSpy = vi.spyOn(httpServer, "close").mockImplementation(
        /* eslint-disable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
        (callback?: any) => {
          if (typeof callback === "function") callback();
          return httpServer;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
      );

      // Call the handler - sigtermCall is verified above
      if (sigtermCall) {
        const handler = sigtermCall[1] as () => void;
        handler();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("SIGTERM received"));
      }

      listenSpy.mockRestore();
      closeSpy.mockRestore();
      processOnSpy.mockRestore();
    });

    it("should register SIGINT signal handler", async () => {
      const { startServer, httpServer } = await import("../../index.js");

      const processOnSpy = vi.spyOn(process, "on");
      const listenSpy = vi.spyOn(httpServer, "listen").mockImplementation(() => httpServer);

      startServer();

      expect(processOnSpy).toHaveBeenCalledWith("SIGINT", expect.any(Function));

      // Get the registered handler and call it to verify it calls gracefulShutdown
      const sigintCall = processOnSpy.mock.calls.find((call) => call[0] === "SIGINT");
      expect(sigintCall).toBeDefined();

      // Mock httpServer.close for the handler test
      const closeSpy = vi.spyOn(httpServer, "close").mockImplementation(
        /* eslint-disable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
        (callback?: any) => {
          if (typeof callback === "function") callback();
          return httpServer;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
      );

      // Call the handler - sigintCall is verified above
      if (sigintCall) {
        const handler = sigintCall[1] as () => void;
        handler();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("SIGINT received"));
      }

      listenSpy.mockRestore();
      closeSpy.mockRestore();
      processOnSpy.mockRestore();
    });
  });

  describe("auto-start behavior", () => {
    it("should not auto-start when imported as module (not main)", async () => {
      // When imported for testing, process.argv[1] won't include "index"
      // so the server should not auto-start
      const { httpServer } = await import("../../index.js");

      // The server should be defined but not listening yet
      // (unless startServer was explicitly called)
      expect(httpServer).toBeDefined();
      expect(httpServer.listening).toBe(false);
    });

    it("should export isRunningAsMain function", async () => {
      const { isRunningAsMain } = await import("../../index.js");
      expect(isRunningAsMain).toBeDefined();
      expect(typeof isRunningAsMain).toBe("function");
    });

    it("should return false when not running as main module", async () => {
      const { isRunningAsMain } = await import("../../index.js");
      // In tests, process.argv[1] is vitest, not index
      expect(isRunningAsMain()).toBe(false);
    });

    it("should return false when process.argv[1] is undefined", async () => {
      const { isRunningAsMain } = await import("../../index.js");
      const originalArgv1 = process.argv[1];

      // Set argv[1] to undefined to test the ?? false branch
      process.argv[1] = undefined as unknown as string;

      expect(isRunningAsMain()).toBe(false);

      // Restore
      process.argv[1] = originalArgv1;
    });

    it("should export initIfMain function", async () => {
      const { initIfMain } = await import("../../index.js");
      expect(initIfMain).toBeDefined();
      expect(typeof initIfMain).toBe("function");
    });

    it("should return false from initIfMain when not main module", async () => {
      const { initIfMain } = await import("../../index.js");
      // In tests, this should return false since we're not running as main
      expect(initIfMain()).toBe(false);
    });

    it("should start server when isRunningAsMain returns true", async () => {
      const { initIfMain, httpServer, isRunningAsMain } = await import("../../index.js");

      // Mock isRunningAsMain to return true
      const originalArgv = process.argv[1];
      process.argv[1] = "/path/to/index.js";

      // Mock httpServer.listen to prevent actual server start
      const listenSpy = vi.spyOn(httpServer, "listen").mockImplementation(
        /* eslint-disable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
        (...args: any[]) => {
          const callback = args[1];
          if (typeof callback === "function") callback();
          return httpServer;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any, promise/prefer-await-to-callbacks */
      );

      // Now isRunningAsMain should return true
      expect(isRunningAsMain()).toBe(true);

      // Call initIfMain - it should start the server
      const result = initIfMain();
      expect(result).toBe(true);
      expect(listenSpy).toHaveBeenCalled();

      // Restore
      process.argv[1] = originalArgv;
      listenSpy.mockRestore();
    });
  });
});
