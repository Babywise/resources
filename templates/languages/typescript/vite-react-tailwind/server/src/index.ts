/**
 * Main Server Entry Point
 *
 * This is the main entry point for the Express server.
 * It initializes the HTTP server and handles graceful shutdown.
 *
 * Architecture Overview:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                         Express Server                          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  REST API                                                       │
 * │  - Health checks                                                │
 * │  - API endpoints                                                │
 * │  - Static file serving (production)                             │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @see https://expressjs.com/
 */

import { createServer } from "http";

import app from "./app.js";
import { config } from "./config/config.js";

/**
 * Server configuration from centralized config module.
 *
 * All values are sourced from config/config.ts which loads from environment
 * variables with sensible defaults. See that file for all available options.
 */
const PORT = config.server.port;
const NODE_ENV = config.server.nodeEnv;

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

/**
 * Create HTTP server wrapping the Express app.
 *
 * Why not just use app.listen()?
 * - Gives us direct access to the HTTP server for graceful shutdown
 * - Allows future addition of WebSocket (Socket.io) on the same server
 * - Better control over server lifecycle
 */
const httpServer = createServer(app);

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

/**
 * Graceful shutdown handler.
 *
 * Ensures:
 * 1. No new connections are accepted
 * 2. Existing connections are allowed to complete
 * 3. Resources are properly cleaned up
 *
 * Without graceful shutdown, active requests would be abruptly terminated,
 * potentially leaving data in an inconsistent state.
 *
 * @param signal - The signal that triggered the shutdown
 */
export function gracefulShutdown(signal: string): void {
  console.log(`\n[Server] ${signal} received, shutting down gracefully...`);
  httpServer.close(() => {
    console.log("[Server] HTTP server closed");
  });
}

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the HTTP server.
 *
 * httpServer.listen() binds to the specified port and starts accepting
 * connections. The callback is called once the server is ready.
 *
 * Common startup issues:
 * - EADDRINUSE: Port is already in use (another process is using it)
 * - EACCES: Permission denied (ports < 1024 require root on Unix)
 * - EADDRNOTAVAIL: The address is not available on this machine
 */
export function startServer(): void {
  httpServer.listen(PORT, () => {
    console.info(`
╔═══════════════════════════════════════════════════════════════╗
║                      EXPRESS SERVER                           ║
╠═══════════════════════════════════════════════════════════════╣
║  Status:      ONLINE                                          ║
║  Environment: ${String(NODE_ENV).padEnd(48)}║
║  Port:        ${String(PORT).padEnd(48)}║
║  URL:         ${`http://localhost:${PORT}`.padEnd(48)}║
╚═══════════════════════════════════════════════════════════════╝
    `);
  });

  // Register signal handlers for graceful shutdown
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

/**
 * Check if this module is being run directly (not imported).
 * Used to auto-start the server only when run as the main entry point.
 */
export function isRunningAsMain(): boolean {
  return process.argv[1]?.includes("index") ?? false;
}

/**
 * Initialize the server if running as main module.
 * Returns true if server was started, false otherwise.
 * Exported for testing the auto-start behavior.
 */
export function initIfMain(): boolean {
  if (isRunningAsMain()) {
    startServer();
    return true;
  }
  return false;
}

// Start the server only when this module is run directly (not imported for testing)
initIfMain();

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Export server instances for testing and external access.
 *
 * - app: The Express application (for supertest in tests)
 * - httpServer: The HTTP server (for manual control)
 * - startServer: Function to start the server
 * - gracefulShutdown: Function to gracefully shutdown the server
 * - isRunningAsMain: Check if running as main module
 * - initIfMain: Initialize server if running as main
 */
export { app, httpServer };
