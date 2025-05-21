import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUrlContext } from "~/contexts/UrlContext";
import { CleanuriOkResponse } from "~/schemas/cleanuriSchemas";
import { History } from "../History";

jest.mock("~/contexts/UrlContext", () => ({
  useUrlContext: jest.fn(),
}));

describe("<History />", () => {
  const mockCopyUrl = jest.fn();
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
    jest.useFakeTimers();
    jest.clearAllMocks();

    (useUrlContext as jest.Mock).mockReturnValue({
      urls: mockUrls,
      copyUrl: mockCopyUrl,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
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

  test("calls copyUrl and changes button text when copy button is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const firstCopyButton = copyButtons[0];

    await user.click(firstCopyButton);

    expect(mockCopyUrl).toHaveBeenCalledWith(mockUrls[0]);
    expect(firstCopyButton).toHaveTextContent("Copied!");
    expect(firstCopyButton).toHaveClass("bg-dark-violet");
  });

  test("reverts button text after 3 seconds", async () => {
    render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    const firstCopyButton = copyButtons[0];

    fireEvent.click(firstCopyButton);

    expect(firstCopyButton).toHaveTextContent("Copied!");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(firstCopyButton).toHaveTextContent("Copy");
    expect(firstCopyButton).toHaveClass("bg-cyan");
  });

  test("handles multiple copy button clicks correctly", async () => {
    render(<History />);

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });

    fireEvent.click(copyButtons[0]);
    expect(copyButtons[0]).toHaveTextContent("Copied!");

    fireEvent.click(copyButtons[1]);
    expect(copyButtons[1]).toHaveTextContent("Copied!");

    expect(copyButtons[0]).toHaveTextContent("Copied!");
    expect(copyButtons[1]).toHaveTextContent("Copied!");

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    fireEvent.click(copyButtons[0]);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(copyButtons[0]).toHaveTextContent("Copied!");
    expect(copyButtons[1]).toHaveTextContent("Copy");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(copyButtons[0]).toHaveTextContent("Copy");
    expect(copyButtons[1]).toHaveTextContent("Copy");
  });

  test("renders empty state when no URLs exist", () => {
    (useUrlContext as jest.Mock).mockReturnValueOnce({
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
    fireEvent.click(copyButtons[0]);
    fireEvent.click(copyButtons[1]);

    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
  });
});
