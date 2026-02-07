import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../../app.js";

describe("GET /api/health", () => {
  it("returns status ok", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("returns a message", async () => {
    const response = await request(app).get("/api/health");

    expect(response.body.message).toBe("Server is running");
  });

  it("returns a timestamp", async () => {
    const response = await request(app).get("/api/health");

    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp).toString()).not.toBe("Invalid Date");
  });
});
