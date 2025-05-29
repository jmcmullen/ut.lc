import { beforeEach, describe, expect, test, vi } from "vitest";
import { handleForm } from "../cleanuriActions";

vi.mock("../cleanuriActions", () => ({
  handleForm: vi.fn(),
}));

describe("cleanuriActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("handles successful URL shortening", async () => {
    vi.mocked(handleForm).mockResolvedValue({
      resultUrl: "https://cleanuri.com/abc123",
      originalUrl: "https://example.com",
    });

    const result = await handleForm({
      data: { url: "https://example.com" },
    });
    expect(handleForm).toHaveBeenCalledWith({
      data: { url: "https://example.com" },
    });

    expect(result).toEqual({
      resultUrl: "https://cleanuri.com/abc123",
      originalUrl: "https://example.com",
    });
  });

  test("handles API error responses", async () => {
    vi.mocked(handleForm).mockResolvedValue({
      error: "Invalid URL",
    });
    const result = await handleForm({
      data: { url: "https://example.com" },
    });

    expect(result).toEqual({
      error: "Invalid URL",
    });
  });

  test("handles fetch exceptions", async () => {
    vi.mocked(handleForm).mockResolvedValue({
      error: "Network error",
    });
    const result = await handleForm({
      data: { url: "https://example.com" },
    });

    expect(result).toEqual({
      error: "Network error",
    });
  });

  test("handles JSON parsing errors", async () => {
    vi.mocked(handleForm).mockResolvedValue({
      error: "Invalid JSON",
    });

    const result = await handleForm({
      data: { url: "https://example.com" },
    });

    expect(result).toEqual({
      error: "Invalid JSON",
    });
  });

  test("handles schema validation errors", async () => {
    vi.mocked(handleForm).mockResolvedValue({
      error: "Invalid input: expected string, received undefined",
    });
    const result = await handleForm({
      data: { url: "https://example.com" },
    });

    expect(result).toHaveProperty("error");
  });
});
