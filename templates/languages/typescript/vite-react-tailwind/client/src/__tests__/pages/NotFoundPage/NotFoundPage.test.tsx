import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NotFoundPage", () => {
  it("renders the 404 code", () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("renders the title", () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
  });

  it("renders the message", () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(/the page you're looking for doesn't exist/i)).toBeInTheDocument();
  });

  it("renders the home link", () => {
    renderWithRouter(<NotFoundPage />);
    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
