import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";
import { Header } from "../Header";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="router-link">
      {children}
    </a>
  ),
}));

vi.mock("~/utils/auth-client", () => ({
  useSession: vi.fn(() => ({ data: null, isPending: false })),
  signIn: {
    social: vi.fn(),
  },
}));

describe("Header Component", () => {
  test("renders logo and navigation links", () => {
    render(<Header />);

    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();

    const links = screen.getAllByTestId("router-link");
    expect(links.length).toBeGreaterThan(0);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("hamburger menu toggles mobile navigation", () => {
    render(<Header />);

    const mobileMenuButton =
      screen.getByLabelText(/open menu/i) || screen.getByLabelText(/close menu/i);
    expect(mobileMenuButton).toBeInTheDocument();

    expect(screen.queryByTestId("mobile-nav")).not.toBeInTheDocument();

    fireEvent.click(mobileMenuButton);

    expect(screen.getByTestId("mobile-nav")).toBeVisible();

    fireEvent.click(mobileMenuButton);

    expect(screen.queryByTestId("mobile-nav")).not.toBeInTheDocument();
  });

  test("responsive design shows/hides elements correctly", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes("(min-width: 1440px)"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { rerender } = render(<Header />);

    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    rerender(<Header />);

    const mobileMenuButton =
      screen.getByLabelText(/open menu/i) || screen.getByLabelText(/close menu/i);
    expect(mobileMenuButton).toBeInTheDocument();

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("(min-width: 1440px)"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    rerender(<Header />);

    const desktopNav = screen.queryByTestId("desktop-nav");
    expect(desktopNav).toBeVisible();
  });
});
