import { and, eq } from "drizzle-orm";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock environment variables
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test?sslmode=require";

// Mock database modules before imports
vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => vi.fn()),
}));

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock("~/api/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "~/api/db";
import { UrlService } from "../url.service";
import { urlTable } from "../url.sql";

const mockUserId = "user_123";

const mockUrl = {
  id: "url_123456789",
  slug: "abc123xyz",
  createdAt: new Date("2025-05-28T16:34:14.123Z"),
  expiresAt: null,
  url: "https://example.com",
  isActive: true,
  userId: mockUserId,
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
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(mockUrls),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.list({ limit: 10, cursor: 0 }, mockUserId);

      expect(result).toEqual(mockUrls);
      expect(db.select).toHaveBeenCalled();
      expect(selectMock.from).toHaveBeenCalledWith(urlTable);
      expect(selectMock.where).toHaveBeenCalledWith(eq(urlTable.userId, mockUserId));
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

      const result = await UrlService.create(
        {
          url: "https://example.com",
        },
        mockUserId,
      );

      expect(result).toEqual(mockUrl);
      expect(db.insert).toHaveBeenCalledWith(urlTable);
      expect(insertMock.values).toHaveBeenCalledWith({
        url: "https://example.com",
        userId: mockUserId,
      });
    });

    test("creates a new URL with custom slug", async () => {
      const customUrl = { ...mockUrl, slug: "custom123" };
      const insertMock = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([customUrl]),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertMock);

      const result = await UrlService.create(
        {
          url: "https://example.com",
          slug: "custom123",
        },
        mockUserId,
      );

      expect(result).toEqual(customUrl);
      expect(insertMock.values).toHaveBeenCalledWith({
        url: "https://example.com",
        userId: mockUserId,
        slug: "custom123",
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

      const result = await UrlService.update(
        "abc123xyz",
        {
          url: "https://updated.com",
        },
        mockUserId,
      );

      expect(result).toEqual(updatedUrl);
      expect(db.update).toHaveBeenCalledWith(urlTable);
      expect(updateMock.set).toHaveBeenCalledWith({
        url: "https://updated.com",
      });
      expect(updateMock.where).toHaveBeenCalledWith(
        and(eq(urlTable.slug, "abc123xyz"), eq(urlTable.userId, mockUserId)),
      );
    });

    test("throws error when URL not found", async () => {
      const updateMock = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateMock);

      await expect(
        UrlService.update("nonexistent", { url: "https://updated.com" }, mockUserId),
      ).rejects.toThrow(
        "URL with slug nonexistent not found or you don't have permission",
      );
    });
  });

  describe("remove", () => {
    test("deletes an existing URL", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUrl]),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      const result = await UrlService.remove("abc123xyz", mockUserId);

      expect(result).toEqual(mockUrl);
      expect(db.delete).toHaveBeenCalledWith(urlTable);
      expect(deleteMock.where).toHaveBeenCalledWith(
        and(eq(urlTable.slug, "abc123xyz"), eq(urlTable.userId, mockUserId)),
      );
    });

    test("throws error when URL not found", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      await expect(UrlService.remove("nonexistent", mockUserId)).rejects.toThrow(
        "URL with slug nonexistent not found or you don't have permission",
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

      const result = await UrlService.findById("url_123456789");

      expect(result).toEqual(mockUrl);
      expect(selectMock.where).toHaveBeenCalledWith(eq(urlTable.id, "url_123456789"));
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

  describe("findBySlug", () => {
    test("returns URL when found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUrl]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.findBySlug("abc123xyz");

      expect(result).toEqual(mockUrl);
      expect(selectMock.where).toHaveBeenCalledWith(eq(urlTable.slug, "abc123xyz"));
      expect(selectMock.limit).toHaveBeenCalledWith(1);
    });

    test("returns null when URL not found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.findBySlug("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("isSlugAvailable", () => {
    test("returns true when slug is available", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.isSlugAvailable("newslug123");

      expect(result).toBe(true);
    });

    test("returns false when slug is taken", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ slug: "taken123" }]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await UrlService.isSlugAvailable("taken123");

      expect(result).toBe(false);
    });
  });
});
