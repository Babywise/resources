import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AppPage from "@/pages/AppPage/AppPage";

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("AppPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ message: "Server OK" }),
        })
      )
    );
  });

  it("renders the title", async () => {
    renderWithRouter(<AppPage />);
    expect(screen.getByRole("heading", { name: /app page/i })).toBeInTheDocument();
    await screen.findByText(/Server OK|Server not connected/);
  });

  it("renders the subtitle", async () => {
    renderWithRouter(<AppPage />);
    expect(screen.getByText(/interactive demo/i)).toBeInTheDocument();
    await screen.findByText(/Server OK|Server not connected/);
  });

  it("renders the back link", async () => {
    renderWithRouter(<AppPage />);
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    await screen.findByText(/Server OK|Server not connected/);
  });

  it("renders the counter with initial value 0", async () => {
    renderWithRouter(<AppPage />);
    expect(screen.getByText("0")).toBeInTheDocument();
    await screen.findByText(/Server OK|Server not connected/);
  });

  it("increments counter on button click", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppPage />);

    expect(screen.getByText("0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /increment/i }));

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("increments counter multiple times", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppPage />);

    await user.click(screen.getByRole("button", { name: /increment/i }));
    await user.click(screen.getByRole("button", { name: /increment/i }));
    await user.click(screen.getByRole("button", { name: /increment/i }));

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays server status after fetch", async () => {
    renderWithRouter(<AppPage />);
    expect(await screen.findByText("Server OK")).toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error")))
    );

    renderWithRouter(<AppPage />);
    expect(await screen.findByText("Server not connected")).toBeInTheDocument();
  });
});
