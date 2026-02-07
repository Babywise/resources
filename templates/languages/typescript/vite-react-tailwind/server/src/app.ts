/**
 * Express Application Configuration
 *
 * This module exports the configured Express app separately from the server.
 * This separation allows:
 * - Testing the app with Supertest without starting the server
 * - Reusing the app configuration in different contexts
 * - Cleaner separation of concerns
 *
 * The main index.ts imports this and attaches it to an HTTP server.
 */

import compression from "compression";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";

import { config } from "./config/config.js";
import { requestLogger } from "./middleware/middleware.js";
import healthRouter from "./routes/health.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Client URL for CORS configuration.
 * Loaded from centralized config module.
 */
const CLIENT_URL = config.server.clientUrl;

// ============================================================================
// APP FACTORY
// ============================================================================

/**
 * Create and configure the Express application.
 *
 * Using a factory function allows:
 * - Creating fresh app instances for testing
 * - Passing different configurations
 * - Better control over initialization order
 */
export function createApp(): Application {
  /**
   * Initialize Express application.
   *
   * Express is a minimal web framework for Node.js that provides:
   * - Routing (mapping URLs to handler functions)
   * - Middleware (functions that process requests in sequence)
   * - Request/response helpers (JSON parsing, status codes, etc.)
   *
   * The app object is the main Express instance. We configure it with
   * middleware and routes, then attach it to an HTTP server.
   */
  const app: Application = express();

  // ============================================================================
  // MIDDLEWARE STACK
  // ============================================================================
  // Middleware functions are executed in order for every request.
  // Each middleware can:
  // - Modify the request/response objects
  // - End the request-response cycle
  // - Call next() to pass control to the next middleware
  //
  // Order matters! Security middleware should come first.

  /**
   * Helmet - Security middleware that sets various HTTP headers.
   *
   * Protects against common web vulnerabilities:
   * - X-Content-Type-Options: Prevents MIME type sniffing
   * - X-Frame-Options: Prevents clickjacking
   * - X-XSS-Protection: Enables browser XSS filter
   * - Strict-Transport-Security: Enforces HTTPS
   * - Content-Security-Policy: Controls resource loading
   *
   * @see https://helmetjs.github.io/
   */
  app.use(helmet());

  /**
   * CORS - Cross-Origin Resource Sharing middleware.
   *
   * Browsers block requests from one origin (domain:port) to another
   * by default. CORS headers tell the browser which cross-origin
   * requests are allowed.
   *
   * Configuration:
   * - origin: Only allow requests from our client URL
   * - credentials: Allow cookies and Authorization headers
   *
   * Without this, the client would get "CORS policy" errors.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
   */
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
    })
  );

  /**
   * Compression - Gzip/Brotli compression for responses.
   *
   * Compresses response bodies to reduce bandwidth usage.
   * Especially effective for JSON responses and static files.
   *
   * The client sends Accept-Encoding header to indicate support,
   * and this middleware compresses accordingly.
   *
   * Typical compression ratios: 60-80% size reduction for text.
   */
  app.use(compression());

  /**
   * Request logger - Logs incoming requests for debugging.
   *
   * Logs the HTTP method, URL, and timestamp for each request.
   * In production, consider using a more robust logging library.
   */
  app.use(requestLogger);

  /**
   * JSON body parser - Parses incoming JSON request bodies.
   *
   * When a client sends a POST/PUT/PATCH request with:
   *   Content-Type: application/json
   *
   * This middleware parses the JSON body and makes it available
   * as `req.body` in route handlers.
   *
   * Without this, req.body would be undefined for JSON requests.
   */
  app.use(express.json());

  /**
   * URL-encoded body parser - Parses form data.
   *
   * When a client sends a POST request with:
   *   Content-Type: application/x-www-form-urlencoded
   *
   * This parses the form data (key=value&key2=value2) into req.body.
   *
   * The `extended: true` option allows nested objects in form data.
   * Example: user[name]=John&user[age]=30 → { user: { name: 'John', age: '30' } }
   */
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // ROUTES
  // ============================================================================

  /**
   * Health check endpoint at root /health.
   *
   * Used by:
   * - Load balancers to check if the server is alive
   * - Monitoring systems to track uptime
   * - Deployment systems to verify successful startup
   *
   * Returns:
   * - status: 'ok' if the server is running
   * - timestamp: Current server time (useful for clock sync debugging)
   * - uptime: How long the server has been running (in seconds)
   *
   * This endpoint should be lightweight and not require authentication.
   */
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  /**
   * Mount the health router at /api/health.
   *
   * All API routes are prefixed with /api:
   * - /api/health - Health check with detailed info
   *
   * This keeps the API organized and allows versioning later:
   * - /api/v1/* - Version 1 (future)
   * - /api/v2/* - Version 2 (future)
   */
  app.use("/api/health", healthRouter);

  return app;
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Pre-configured Express app instance.
 * Use this for testing or when you need the app without starting a server.
 */
const app = createApp();

export default app;
export { app };
