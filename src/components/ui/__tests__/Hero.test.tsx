import { render, screen } from "@testing-library/react";
import { Hero } from "../Hero";

describe("Hero Component", () => {
  test("renders the hero section with all elements", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", {
        name: /more than just shorter links/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/build your brand's recognition/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/get started/i)).toBeInTheDocument();

    expect(screen.getByAltText("Person working")).toBeInTheDocument();
  });
});
