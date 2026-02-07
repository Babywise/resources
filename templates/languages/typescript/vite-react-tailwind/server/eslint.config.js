/**
 * ESLint Configuration - Main Server
 *
 * This config uses ESLint's new flat config format (eslint.config.js).
 * It sets up comprehensive linting for a Node.js/Express TypeScript server.
 *
 * Plugins included:
 * - @eslint/js: Core ESLint rules
 * - typescript-eslint: TypeScript-specific rules
 * - eslint-plugin-n: Node.js specific rules
 * - eslint-plugin-import: Import/export syntax rules
 * - eslint-plugin-promise: Promise best practices
 * - eslint-plugin-security: Security vulnerability detection
 * - eslint-config-prettier: Disables rules that conflict with Prettier
 * - eslint-plugin-prettier: Runs Prettier as an ESLint rule
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */

import path from "path";
import { fileURLToPath } from "url";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginN from "eslint-plugin-n";
import pluginImport from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";
import pluginSecurity from "eslint-plugin-security";
import pluginPrettier from "eslint-plugin-prettier";

// Get the directory of this config file for tsconfigRootDir
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// IGNORED PATHS
// ============================================================================

const ignoreConfig = globalIgnores(["dist", "src/generated"]);

// ============================================================================
// BASE CONFIGURATION
// ============================================================================

const baseConfig = {
  files: ["**/*.ts"],
  extends: [js.configs.recommended],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.node,
      ...globals.es2022,
    },
  },
};

// ============================================================================
// TYPESCRIPT CONFIGURATION
// ============================================================================

const typescriptConfig = {
  files: ["**/*.ts"],
  extends: [tseslint.configs.recommended],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.json", "./tsconfig.node.json"],
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    // Unused variables - allow underscore prefix for intentionally unused
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    // Don't require explicit return types (inference is fine)
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Warn on any usage but don't error (sometimes necessary)
    "@typescript-eslint/no-explicit-any": "warn",
    // Require await in async functions
    "@typescript-eslint/require-await": "off",
    // Allow empty functions (useful for no-op callbacks)
    "@typescript-eslint/no-empty-function": "off",
  },
};

// ============================================================================
// NODE.JS CONFIGURATION
// ============================================================================

const nodeConfig = {
  files: ["**/*.ts"],
  plugins: {
    n: pluginN,
  },
  rules: {
    // Ensure callbacks handle errors
    "n/handle-callback-err": "error",
    // Disallow deprecated APIs
    "n/no-deprecated-api": "error",
    // Ensure process.exit() is not called directly (use proper shutdown)
    "n/no-process-exit": "warn",
    // Prefer global Buffer/process/etc
    "n/prefer-global/buffer": "error",
    "n/prefer-global/process": "error",
    // Don't check for missing imports (TypeScript handles this)
    "n/no-missing-import": "off",
    "n/no-unpublished-import": "off",
  },
};

// ============================================================================
// IMPORT CONFIGURATION
// ============================================================================

const importConfig = {
  files: ["**/*.ts"],
  plugins: {
    import: pluginImport,
  },
  rules: {
    // Ensure imports are at the top
    "import/first": "error",
    // Ensure consistent import order
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // npm packages
          "internal", // Internal modules
          "parent", // Parent directory imports
          "sibling", // Same directory imports
          "index", // Index file imports
          "type", // Type imports
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    // No duplicate imports
    "import/no-duplicates": "error",
    // Prefer named exports for better tree-shaking
    "import/prefer-default-export": "off",
    // Don't check for unresolved imports (TypeScript handles this)
    "import/no-unresolved": "off",
  },
};

// ============================================================================
// PROMISE CONFIGURATION
// ============================================================================

const promiseConfig = {
  files: ["**/*.ts"],
  plugins: {
    promise: pluginPromise,
  },
  rules: {
    // Always return in promise callbacks
    "promise/always-return": "warn",
    // Catch errors in promises
    "promise/catch-or-return": "warn",
    // No nesting promises unnecessarily
    "promise/no-nesting": "warn",
    // No returning in finally
    "promise/no-return-in-finally": "error",
    // Prefer await over .then()
    "promise/prefer-await-to-then": "warn",
    "promise/prefer-await-to-callbacks": "warn",
  },
};

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

const securityConfig = {
  files: ["**/*.ts"],
  plugins: {
    security: pluginSecurity,
  },
  rules: {
    // Detect potential security issues
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "warn",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-new-buffer": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-non-literal-require": "warn",
    "security/detect-object-injection": "off", // Too many false positives
    "security/detect-possible-timing-attacks": "warn",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-unsafe-regex": "error",
  },
};

// ============================================================================
// CODE QUALITY CONFIGURATION
// ============================================================================

const codeQualityConfig = {
  files: ["**/*.ts"],
  rules: {
    // Console is allowed in servers (for logging)
    "no-console": "off",
    // Prefer const over let
    "prefer-const": "error",
    // No var declarations
    "no-var": "error",
    // Prefer template literals
    "prefer-template": "warn",
    // Prefer arrow functions for callbacks
    "prefer-arrow-callback": "warn",
    // No unused expressions
    "no-unused-expressions": "error",
    // Require === and !==
    eqeqeq: ["error", "always"],
    // No debugger statements
    "no-debugger": "error",
    // Consistent return statements
    "consistent-return": "off", // TypeScript handles this better
    // Max line length (Prettier handles this, but warn on very long lines)
    "max-len": ["warn", { code: 120, ignoreComments: true, ignoreStrings: true }],
  },
};

// ============================================================================
// PRETTIER CONFIGURATION (must be last)
// ============================================================================

const prettierConfig = {
  files: ["**/*.{ts,tsx}"],
  plugins: {
    prettier: pluginPrettier,
  },
  extends: [eslintConfigPrettier],
  rules: {
    "prettier/prettier": "warn",
  },
};

// ============================================================================
// EXPORT COMBINED CONFIGURATION
// ============================================================================

export default defineConfig([
  ignoreConfig,
  baseConfig,
  typescriptConfig,
  nodeConfig,
  importConfig,
  promiseConfig,
  securityConfig,
  codeQualityConfig,
  prettierConfig,
]);
