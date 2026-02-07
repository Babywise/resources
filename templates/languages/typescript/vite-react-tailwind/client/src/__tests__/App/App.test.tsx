import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import App from "@/App";

describe("App", () => {
  it("renders the home page by default", () => {
    render(<App />);
    expect(screen.getByText("Client-Server Template")).toBeInTheDocument();
  });

  it("renders the home page title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /client-server template/i })).toBeInTheDocument();
  });

  it("has a link to the app page", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /go to app/i })).toBeInTheDocument();
  });
});
