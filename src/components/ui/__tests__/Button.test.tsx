import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("<Button />", () => {
  test("renders button with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-cyan");
    expect(button).toHaveClass("rounded-full");
  });

  test("applies different variants correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-cyan");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-dark-violet");
  });

  test("applies different sizes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("py-2", "px-4", "text-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("py-2", "px-6", "text-base");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("py-3", "px-8", "text-lg");
  });

  test("applies fullWidth prop correctly", () => {
    const { rerender } = render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");

    rerender(<Button fullWidth={false}>Normal Width</Button>);
    expect(screen.getByRole("button")).not.toHaveClass("w-full");
  });

  test("applies rounded prop correctly", () => {
    const { rerender } = render(<Button rounded>Rounded</Button>);
    expect(screen.getByRole("button")).toHaveClass("rounded-full");

    rerender(<Button rounded={false}>Less Rounded</Button>);
    expect(screen.getByRole("button")).toHaveClass("rounded-md");
    expect(screen.getByRole("button")).not.toHaveClass("rounded-full");
  });

  test("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});
