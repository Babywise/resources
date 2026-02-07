/**
 * Centralized Application Configuration
 *
 * This module provides a single source of truth for all configurable
 * constants throughout the application. Values are loaded from environment
 * variables with sensible defaults for development.
 *
 * Configuration Categories:
 * - Server: Ports, URLs, environment
 *
 * Usage:
 * ```typescript
 * import { config } from './config/config.js'
 *
 * const port = config.server.port
 * const clientUrl = config.server.clientUrl
 * ```
 */

import path from "path";
import { fileURLToPath } from "url";

import { config as dotenvConfig } from "dotenv";

// Load .env from project root before reading any environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: path.resolve(__dirname, "../../../.env") });

// ============================================================================
// ENVIRONMENT HELPERS
// ============================================================================

/**
 * Get an environment variable with a default value.
 */
function env(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Get an environment variable as a number.
 */
function envNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// ============================================================================
// SERVER CONFIGURATION
// ============================================================================

export const serverConfig = {
  /** Server port (default: 3000) */
  port: envNumber("PORT", 3000),

  /** Node environment (development, production, test) */
  nodeEnv: env("NODE_ENV", "development"),

  /** Whether we're in development mode */
  isDev: env("NODE_ENV", "development") === "development",

  /** Whether we're in production mode */
  isProd: env("NODE_ENV", "development") === "production",

  /** Client URL for CORS */
  clientUrl: `http://localhost:${env("VITE_DEV_PORT", "5173")}`,

  /** Log level (not in .env by default, allows testing default branch) */
  logLevel: env("LOG_LEVEL", "info"),

  /** Request timeout in ms (not in .env by default, allows testing envNumber default branch) */
  requestTimeout: envNumber("REQUEST_TIMEOUT", 30000),
} as const;

// ============================================================================
// COMBINED CONFIG EXPORT
// ============================================================================

/**
 * Complete application configuration.
 *
 * Import this for access to all config sections:
 * ```typescript
 * import { config } from './config/config.js'
 *
 * console.log(config.server.port)
 * console.log(config.server.clientUrl)
 * ```
 */
export const config = {
  server: serverConfig,
} as const;

export type Config = typeof config;

// Default export for convenience
export default config;
