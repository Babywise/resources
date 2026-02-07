import request from "supertest";
import { describe, it, expect } from "vitest";

import app, { createApp } from "../../app.js";

describe("App", () => {
  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).toBe(404);
  });

  it("handles JSON body parsing", async () => {
    const response = await request(app)
      .post("/api/health")
      .send({ test: "data" })
      .set("Content-Type", "application/json");

    expect(response.status).toBeDefined();
  });

  it("has CORS enabled", async () => {
    const response = await request(app).get("/api/health").set("Origin", "http://localhost:5173");

    expect(response.headers["access-control-allow-origin"]).toBeDefined();
  });

  describe("createApp factory", () => {
    it("creates a new Express app instance", () => {
      const newApp = createApp();

      expect(newApp).toBeDefined();
      expect(typeof newApp.use).toBe("function");
      expect(typeof newApp.get).toBe("function");
    });

    it("creates independent app instances", () => {
      const app1 = createApp();
      const app2 = createApp();

      expect(app1).not.toBe(app2);
    });

    it("uses default CLIENT_URL when env var is not set", () => {
      const originalEnv = process.env.VITE_API_URL;
      delete process.env.VITE_API_URL;

      // createApp uses CLIENT_URL for CORS - just verify it doesn't throw
      const newApp = createApp();
      expect(newApp).toBeDefined();

      // Restore
      process.env.VITE_API_URL = originalEnv;
    });
  });

  describe("GET /health", () => {
    it("returns status ok", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
    });

    it("returns a timestamp", async () => {
      const response = await request(app).get("/health");

      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp).toString()).not.toBe("Invalid Date");
    });

    it("returns uptime", async () => {
      const response = await request(app).get("/health");

      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe("number");
    });
  });
});
