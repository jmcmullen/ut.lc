import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import type { useUrlContext } from "~/contexts/UrlContext";
import type { CleanuriOkResponse } from "~/schemas/cleanuriSchemas";
import { History } from "../History";

vi.mock("~/contexts/UrlContext", () => ({
  useUrlContext: vi.fn(),
}));

describe("<History />", () => {
  const mockCopyUrl = vi.fn();
  const mockUrls: CleanuriOkResponse[] = [
    {
      resultUrl: "https://cleanuri.com/abc123",
      originalUrl:
        "https://example.com/very/long/original/url/that/needs/to/be/shortened",
    },
    {
      resultUrl: "https://cleanuri.com/def456",
      originalUrl: "https://another-example.com/path/to/page",
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    (useUrlContext as ReturnType<typeof vi.fn>).mockReturnValue({
      urls: mockUrls,
      copyUrl: mockCopyUrl,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders all shortened URLs in history", () => {
    render(<History />);

    mockUrls.forEach((url) => {
      expect(screen.getByText(url.originalUrl)).toBeInTheDocument();
      expect(screen.getByText(url.resultUrl)).toBeInTheDocument();
    });

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    expect(copyButtons).toHaveLength(mockUrls.length);
  });

  test("calls copyUrl and changes button text when copy button is clicked", () => {
    render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    if (!copyButtons[0]) {
      throw new Error("Copy button not found");
    }
    const firstCopyButton = copyButtons[0];

    fireEvent.click(firstCopyButton);

    expect(mockCopyUrl).toHaveBeenCalledWith(mockUrls[0]);
    expect(firstCopyButton).toHaveTextContent("Copied!");
    expect(firstCopyButton).toHaveClass("bg-dark-violet");
  });

  test("reverts button text after 3 seconds", () => {
    render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    if (!copyButtons[0] || !copyButtons[1]) {
      throw new Error("Copy buttons not found");
    }
    const firstCopyButton = copyButtons[0];

    fireEvent.click(firstCopyButton);

    expect(firstCopyButton).toHaveTextContent("Copied!");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(firstCopyButton).toHaveTextContent("Copy");
    expect(firstCopyButton).toHaveClass("bg-cyan");
  });

  test("handles multiple copy button clicks correctly", () => {
    render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    if (!copyButtons[0] || !copyButtons[1]) {
      throw new Error("Copy buttons not found");
    }

    fireEvent.click(copyButtons[0]);
    expect(copyButtons[0]).toHaveTextContent("Copied!");

    fireEvent.click(copyButtons[1]);
    expect(copyButtons[1]).toHaveTextContent("Copied!");

    expect(copyButtons[0]).toHaveTextContent("Copied!");
    expect(copyButtons[1]).toHaveTextContent("Copied!");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    fireEvent.click(copyButtons[0]);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(copyButtons[0]).toHaveTextContent("Copied!");
    expect(copyButtons[1]).toHaveTextContent("Copy");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(copyButtons[0]).toHaveTextContent("Copy");
    expect(copyButtons[1]).toHaveTextContent("Copy");
  });

  test("renders empty state when no URLs exist", () => {
    (useUrlContext as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      urls: [],
      copyUrl: mockCopyUrl,
    });

    render(<History />);

    const copyButtons = screen.queryAllByRole("button", { name: /copy/i });
    expect(copyButtons).toHaveLength(0);
  });

  test("clears all timeouts when component unmounts", () => {
    const { unmount } = render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    if (!copyButtons[0] || !copyButtons[1]) {
      throw new Error("Copy buttons not found");
    }
    fireEvent.click(copyButtons[0]);
    fireEvent.click(copyButtons[1]);

    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  });
});
