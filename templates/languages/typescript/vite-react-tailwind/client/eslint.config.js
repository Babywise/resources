/**
 * ESLint Configuration - Client
 *
 * This config uses ESLint's new flat config format (eslint.config.js).
 * It sets up comprehensive linting for a React/TypeScript application.
 *
 * Plugins included:
 * - @eslint/js: Core ESLint rules
 * - typescript-eslint: TypeScript-specific rules
 * - eslint-plugin-react-hooks: React hooks rules (exhaustive-deps, rules-of-hooks)
 * - eslint-plugin-react-refresh: Ensures components are compatible with Fast Refresh
 * - eslint-plugin-import: Import/export syntax rules
 * - eslint-plugin-jsx-a11y: Accessibility rules for JSX
 * - eslint-plugin-promise: Promise best practices
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
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginImport from "eslint-plugin-import";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginPromise from "eslint-plugin-promise";
import pluginPrettier from "eslint-plugin-prettier";

// Get the directory of this config file for tsconfigRootDir
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// IGNORED PATHS
// ============================================================================

const ignoreConfig = globalIgnores(["dist", "coverage"]);

// ============================================================================
// BASE CONFIGURATION
// ============================================================================

const baseConfig = {
  files: ["**/*.{ts,tsx}"],
  extends: [js.configs.recommended],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.es2022,
    },
  },
};

// ============================================================================
// TYPESCRIPT CONFIGURATION
// ============================================================================

const typescriptConfig = {
  files: ["**/*.{ts,tsx}"],
  extends: [tseslint.configs.recommended],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.app.json", "./tsconfig.node.json"],
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
    // Allow empty functions (useful for no-op callbacks)
    "@typescript-eslint/no-empty-function": "off",
  },
};

// ============================================================================
// REACT CONFIGURATION
// ============================================================================

const reactConfig = {
  files: ["**/*.{ts,tsx}"],
  extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  rules: {
    // React hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // React Refresh - warn on non-component exports
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};

// ============================================================================
// ACCESSIBILITY CONFIGURATION
// ============================================================================

const accessibilityConfig = {
  files: ["**/*.{ts,tsx}"],
  plugins: {
    "jsx-a11y": pluginJsxA11y,
  },
  rules: {
    // Ensure interactive elements are focusable
    "jsx-a11y/interactive-supports-focus": "warn",
    // Ensure clickable elements have keyboard support
    "jsx-a11y/click-events-have-key-events": "warn",
    // Ensure non-interactive elements don't have handlers
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    // Alt text for images
    "jsx-a11y/alt-text": "error",
    // Anchor tags must have content
    "jsx-a11y/anchor-has-content": "error",
    // No autofocus (can be disorienting)
    "jsx-a11y/no-autofocus": "warn",
    // Labels must have associated controls
    "jsx-a11y/label-has-associated-control": "warn",
  },
};

// ============================================================================
// IMPORT CONFIGURATION
// ============================================================================

const importConfig = {
  files: ["**/*.{ts,tsx}"],
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
    // Don't check for unresolved imports (TypeScript handles this)
    "import/no-unresolved": "off",
  },
};

// ============================================================================
// PROMISE CONFIGURATION
// ============================================================================

const promiseConfig = {
  files: ["**/*.{ts,tsx}"],
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
  },
};

// ============================================================================
// CODE QUALITY CONFIGURATION
// ============================================================================

const codeQualityConfig = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    // Console warnings (allow warn/error for debugging)
    "no-console": ["warn", { allow: ["warn", "error"] }],
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
  reactConfig,
  accessibilityConfig,
  importConfig,
  promiseConfig,
  codeQualityConfig,
  prettierConfig,
]);
