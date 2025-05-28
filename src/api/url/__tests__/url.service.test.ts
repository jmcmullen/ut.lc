/**
 * @vitest-environment node
 */
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { UrlService } from "../url.service";

vi.mock("~/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "~/db";
import { urlTable } from "../url.sql";

const mockUrl = {
  id: "abc123xyz",
  createdAt: new Date("2025-05-28T16:34:14.123Z"),
  expiresAt: null,
  url: "https://example.com",
  isActive: true,
};

describe("UrlService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    test("returns paginated list of URLs", async () => {
      const mockUrls = [mockUrl];
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(mockUrls),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.list({ limit: 10, cursor: 0 });

      expect(result).toEqual(mockUrls);
      expect(db.select).toHaveBeenCalled();
      expect(selectMock.from).toHaveBeenCalledWith(urlTable);
      expect(selectMock.limit).toHaveBeenCalledWith(10);
      expect(selectMock.offset).toHaveBeenCalledWith(0);
    });
  });

  describe("create", () => {
    test("creates a new URL without custom ID", async () => {
      const insertMock = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUrl]),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertMock);

      const result = await UrlService.create({
        url: "https://example.com",
      });

      expect(result).toEqual(mockUrl);
      expect(db.insert).toHaveBeenCalledWith(urlTable);
      expect(insertMock.values).toHaveBeenCalledWith({
        url: "https://example.com",
      });
    });

    test("creates a new URL with custom ID", async () => {
      const customUrl = { ...mockUrl, id: "custom123" };
      const insertMock = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([customUrl]),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertMock);

      const result = await UrlService.create({
        url: "https://example.com",
        id: "custom123",
      });

      expect(result).toEqual(customUrl);
      expect(insertMock.values).toHaveBeenCalledWith({
        url: "https://example.com",
        id: "custom123",
      });
    });
  });

  describe("update", () => {
    test("updates an existing URL", async () => {
      const updatedUrl = { ...mockUrl, url: "https://updated.com" };
      const updateMock = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedUrl]),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateMock);

      const result = await UrlService.update("abc123xyz", {
        url: "https://updated.com",
      });

      expect(result).toEqual(updatedUrl);
      expect(db.update).toHaveBeenCalledWith(urlTable);
      expect(updateMock.set).toHaveBeenCalledWith({
        url: "https://updated.com",
      });
      expect(updateMock.where).toHaveBeenCalledWith(eq(urlTable.id, "abc123xyz"));
    });

    test("throws error when URL not found", async () => {
      const updateMock = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateMock);

      await expect(
        UrlService.update("nonexistent", { url: "https://updated.com" }),
      ).rejects.toThrow("URL with id nonexistent not found");
    });
  });

  describe("remove", () => {
    test("deletes an existing URL", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUrl]),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      const result = await UrlService.remove("abc123xyz");

      expect(result).toEqual(mockUrl);
      expect(db.delete).toHaveBeenCalledWith(urlTable);
      expect(deleteMock.where).toHaveBeenCalledWith(eq(urlTable.id, "abc123xyz"));
    });

    test("throws error when URL not found", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      await expect(UrlService.remove("nonexistent")).rejects.toThrow(
        "URL with id nonexistent not found",
      );
    });
  });

  describe("findById", () => {
    test("returns URL when found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUrl]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.findById("abc123xyz");

      expect(result).toEqual(mockUrl);
      expect(selectMock.where).toHaveBeenCalledWith(eq(urlTable.id, "abc123xyz"));
      expect(selectMock.limit).toHaveBeenCalledWith(1);
    });

    test("returns null when URL not found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.findById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("isIdAvailable", () => {
    test("returns true when ID is available", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.isIdAvailable("newid123");

      expect(result).toBe(true);
    });

    test("returns false when ID is taken", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ id: "taken123" }]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.isIdAvailable("taken123");

      expect(result).toBe(false);
    });
  });
});
