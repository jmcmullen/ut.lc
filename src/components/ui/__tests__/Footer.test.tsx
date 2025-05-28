import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Footer } from "../Footer";

vi.mock("~/assets/images/icon-facebook.svg", () => ({ default: "facebook-icon-mock" }));
vi.mock("~/assets/images/icon-twitter.svg", () => ({ default: "twitter-icon-mock" }));
vi.mock("~/assets/images/icon-pinterest.svg", () => ({ default: "pinterest-icon-mock" }));
vi.mock("~/assets/images/icon-instagram.svg", () => ({ default: "instagram-icon-mock" }));

describe("<Footer />", () => {
  test("renders the logo", () => {
    render(<Footer />);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  test("renders the section headers & links", () => {
    render(<Footer />);

    expect(screen.getByText(/features/i)).toBeInTheDocument();
    expect(screen.getByText(/link shortening/i)).toBeInTheDocument();
    expect(screen.getByText(/branded links/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();

    expect(screen.getByText(/resources/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByText(/developers/i)).toBeInTheDocument();
    expect(screen.getByText(/support/i)).toBeInTheDocument();

    expect(screen.getByText(/company/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/our team/i)).toBeInTheDocument();
    expect(screen.getByText(/careers/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  test("renders the social icons", () => {
    render(<Footer />);

    expect(screen.getByAltText("Facebook icon")).toBeInTheDocument();
    expect(screen.getByAltText("Twitter icon")).toBeInTheDocument();
    expect(screen.getByAltText("Pinterest icon")).toBeInTheDocument();
    expect(screen.getByAltText("Instagram icon")).toBeInTheDocument();
  });
});
