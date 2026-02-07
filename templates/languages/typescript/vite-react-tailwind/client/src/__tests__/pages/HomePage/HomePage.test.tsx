import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import HomePage from "@/pages/HomePage/HomePage";

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("HomePage", () => {
  it("renders the title", () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByRole("heading", { name: /client-server template/i })).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/react \+ typescript \+ vite/i)).toBeInTheDocument();
  });

  it("renders feature cards", () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("Tailwind v4")).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();
  });

  it("renders the CTA link", () => {
    renderWithRouter(<HomePage />);
    const link = screen.getByRole("link", { name: /go to app/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/app");
  });

  it("renders the React logo", () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByAltText("React Logo")).toBeInTheDocument();
  });
});
