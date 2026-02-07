/**
 * Vite Configuration
 *
 * Vite is our build tool and dev server. This config handles:
 * - Development server with hot module replacement (HMR)
 * - Production builds with optimization
 * - Plugin configuration (React, Tailwind)
 * - Path aliases for cleaner imports
 * - Code splitting for better load performance
 * - Environment-based configuration for ports
 *
 * Environment Variables:
 * - VITE_DEV_PORT: Development server port (default: 5173)
 * - VITE_PREVIEW_PORT: Preview server port (default: 4173)
 *
 * @see https://vitejs.dev/config/
 * @see https://vite.dev/config/#using-environment-variables-in-config
 */

import fs from "fs";
import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  /**
   * Load environment variables with fallback strategy:
   * 1. First try to load from client folder
   * 2. If no .env file exists in client, fall back to monorepo root
   * The third parameter '' loads all env vars regardless of VITE_ prefix.
   * Note: Non-VITE_ prefixed vars are only available in config, not in app code.
   */
  const clientDir = __dirname;
  const rootDir = path.resolve(__dirname, "..");
  const clientEnvExists =
    fs.existsSync(path.join(clientDir, `.env.${mode}`)) ||
    fs.existsSync(path.join(clientDir, ".env"));
  const envDir = clientEnvExists ? clientDir : rootDir;
  const env = loadEnv(mode, envDir, "");

  /**
   * Parse port from environment with fallback defaults.
   * Ports must be numbers, so we parse and validate.
   */
  const devPort = env.VITE_DEV_PORT ? Number(env.VITE_DEV_PORT) : 5173;
  const previewPort = env.VITE_PREVIEW_PORT ? Number(env.VITE_PREVIEW_PORT) : 4173;

  return {
    /**
     * Directory to load .env files from.
     * Uses client folder if .env exists there, otherwise monorepo root.
     */
    envDir: envDir,

    // -------------------------------------------------------------------------
    // PLUGINS
    // -------------------------------------------------------------------------
    plugins: [
      /**
       * React plugin enables:
       * - Fast Refresh (HMR for React components)
       * - JSX transformation
       * - React-specific optimizations
       */
      react(),

      /**
       * Tailwind CSS v4 plugin
       * Processes CSS with Tailwind's JIT compiler
       */
      tailwindcss(),
    ],

    // -------------------------------------------------------------------------
    // PATH RESOLUTION
    // -------------------------------------------------------------------------
    resolve: {
      alias: {
        /**
         * '@' alias points to the src directory.
         * Allows imports like: import { store } from '@/store'
         * Instead of: import { store } from '../../../store'
         */
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // -------------------------------------------------------------------------
    // BUILD CONFIGURATION
    // -------------------------------------------------------------------------
    build: {
      /**
       * Target modern browsers that support ES2020 features.
       * This allows Vite to output smaller, more efficient code.
       *
       * ES2020 includes: optional chaining (?.), nullish coalescing (??),
       * BigInt, dynamic import(), etc.
       */
      target: "es2020",

      /**
       * Generate source maps for production builds.
       * Useful for debugging production issues.
       * Set to false if you want smaller builds and don't need debugging.
       */
      sourcemap: true,

      /**
       * Chunk size warning limit in KB.
       * Warns if any chunk exceeds this size.
       */
      chunkSizeWarningLimit: 1000,
    },

    // -------------------------------------------------------------------------
    // DEVELOPMENT SERVER
    // -------------------------------------------------------------------------
    server: {
      /**
       * Port for the dev server.
       * Configurable via VITE_DEV_PORT environment variable.
       * Access the app at http://localhost:{devPort}
       */
      port: devPort,

      /**
       * Open browser automatically when starting dev server.
       * Set to false if you prefer to open manually.
       */
      open: false,

      /**
       * CORS configuration for development.
       * Allows the dev server to make requests to the game server.
       */
      cors: true,

      /**
       * Proxy API requests to the backend server during development.
       *
       * When the client makes a request to /api/*, Vite intercepts it
       * and forwards it to the Express server. This avoids CORS issues
       * and simulates the production setup where both are served together.
       */
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
        "/health": {
          target: env.VITE_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },

    // -------------------------------------------------------------------------
    // PREVIEW SERVER (for testing production builds locally)
    // -------------------------------------------------------------------------
    preview: {
      /**
       * Port for the preview server.
       * Configurable via VITE_PREVIEW_PORT environment variable.
       */
      port: previewPort,
    },

    // -------------------------------------------------------------------------
    // OPTIMIZATION
    // -------------------------------------------------------------------------
    optimizeDeps: {
      /**
       * Dependencies to pre-bundle during dev server startup.
       * Pre-bundling converts CommonJS modules to ESM and combines
       * many small files into fewer larger ones for faster loading.
       *
       * Include dependencies that:
       * - Are CommonJS (not ESM)
       * - Have many small files
       * - Are used frequently
       */
      include: ["react", "react-dom"],
      /**
       * Exclude packages that should not be pre-bundled.
       * These are ESM packages that work correctly without pre-bundling.
       */
      exclude: [],
      /**
       * Force re-optimization on every dev server start.
       * Useful when debugging dependency issues.
       */
      force: true,
    },
  };
});
