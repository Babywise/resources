/**
 * Application Entry Point
 *
 * This is the first JavaScript file that runs when the app loads.
 * It sets up the React application and mounts it to the DOM.
 *
 * The component hierarchy established here:
 *
 * <StrictMode>           - React development helper (catches bugs)
 *     <App />            - Our root application component
 * </StrictMode>
 *
 * @see https://react.dev/reference/react/StrictMode
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

/**
 * Mount the React application to the DOM.
 *
 * createRoot() is React 18's new API for rendering (replaces ReactDOM.render).
 * It enables concurrent features like automatic batching and transitions.
 *
 * The '!' after getElementById is TypeScript's non-null assertion.
 * We're telling TypeScript "trust me, this element exists" because
 * we know index.html has a <div id="root"></div>.
 */
createRoot(document.getElementById("root")!).render(
  /**
   * StrictMode is a development-only component that:
   * - Renders components twice to detect side effects
   * - Warns about deprecated lifecycle methods
   * - Warns about legacy string ref API usage
   * - Warns about findDOMNode usage
   * - Detects unexpected side effects
   *
   * It has NO effect in production builds.
   * The double-rendering can cause confusion (e.g., useEffect runs twice)
   * but it helps catch bugs early.
   */
  <StrictMode>
    <App />
  </StrictMode>
);
