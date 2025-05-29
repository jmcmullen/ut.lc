import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { beforeEach, describe, expect, test, vi } from "vitest";
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

      // Mock isSlugAvailable to return true (available)
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]), // No existing slug found
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);
      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertMock);

      const result = await UrlService.create(
        {
          url: "https://example.com",
          slug: "custom123",
        },
        mockUserId,
      );

      expect(result).toEqual(customUrl);
      expect(db.select).toHaveBeenCalled(); // Check that slug availability was checked
      expect(insertMock.values).toHaveBeenCalledWith({
        url: "https://example.com",
        userId: mockUserId,
        slug: "custom123",
      });
    });

    test("throws error when custom slug is already taken", async () => {
      // Mock isSlugAvailable to return false (not available)
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ slug: "taken123" }]), // Existing slug found
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      try {
        await UrlService.create(
          {
            url: "https://example.com",
            slug: "taken123",
          },
          mockUserId,
        );
        // Should not reach this line
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(ORPCError);
        expect(error).toHaveProperty(
          "message",
          "Slug 'taken123' is already taken. Please choose a different slug.",
        );
        expect(error).toHaveProperty("code", "CONFLICT");
      }

      // Verify that insert was never called
      expect(db.insert).not.toHaveBeenCalled();
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
        "url_123456789",
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
        and(eq(urlTable.id, "url_123456789"), eq(urlTable.userId, mockUserId)),
      );
    });

    test("updates URL with new slug when available", async () => {
      const updatedUrl = { ...mockUrl, slug: "newslug123" };

      // Mock isSlugAvailable to return true (available)
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]), // No existing slug found
      };

      const updateMock = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedUrl]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);
      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateMock);

      const result = await UrlService.update(
        "url_123456789",
        { slug: "newslug123" },
        mockUserId,
      );

      expect(result).toEqual(updatedUrl);
      expect(db.select).toHaveBeenCalled(); // Check that slug availability was checked
      expect(updateMock.set).toHaveBeenCalledWith({ slug: "newslug123" });
    });

    test("throws error when updating with taken slug", async () => {
      // Mock isSlugAvailable to return false (not available)
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ slug: "taken123" }]), // Existing slug found
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      try {
        await UrlService.update("url_123456789", { slug: "taken123" }, mockUserId);
        // Should not reach this line
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(ORPCError);
        expect(error).toHaveProperty(
          "message",
          "Slug 'taken123' is already taken. Please choose a different slug.",
        );
        expect(error).toHaveProperty("code", "CONFLICT");
      }

      // Verify that update was never called
      expect(db.update).not.toHaveBeenCalled();
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
      ).rejects.toThrow(ORPCError);
    });
  });

  describe("remove", () => {
    test("deletes an existing URL", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockUrl]),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      const result = await UrlService.remove("url_123456789", mockUserId);

      expect(result).toEqual(mockUrl);
      expect(db.delete).toHaveBeenCalledWith(urlTable);
      expect(deleteMock.where).toHaveBeenCalledWith(
        and(eq(urlTable.id, "url_123456789"), eq(urlTable.userId, mockUserId)),
      );
    });

    test("throws error when URL not found", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      await expect(UrlService.remove("nonexistent", mockUserId)).rejects.toThrow(
        ORPCError,
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
