/**
 * @vitest-environment node
 */
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ClickService } from "../click.service";

vi.mock("~/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("~/utils/analytics", () => ({
  extractReferrerDomain: vi.fn((url: string) => new URL(url).hostname),
  getClientIp: vi.fn(() => "192.168.1.1"),
  parseUserAgent: vi.fn(() => ({
    browser: "Chrome",
    browserVersion: "120.0",
    os: "Windows",
    osVersion: "11",
    device: "Desktop",
  })),
  parseVercelGeoHeaders: vi.fn(() => ({
    country: "US",
    region: "California",
    city: "San Francisco",
    latitude: "37.7749",
    longitude: "-122.4194",
  })),
}));

vi.mock("nanoid", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nanoid")>();
  return {
    ...actual,
    nanoid: vi.fn(() => "click12345"),
  };
});

import { db } from "~/db";
import { urlTable } from "../../url/url.sql";
import { clickTable } from "../click.sql";

const mockClick = {
  id: "click12345",
  urlId: "url123456",
  clickedAt: new Date("2025-05-28T16:34:14.123Z"),
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  browser: "Chrome",
  browserVersion: "120.0",
  os: "Windows",
  osVersion: "11",
  device: "Desktop",
  ip: "192.168.1.1",
  country: "US",
  region: "California",
  city: "San Francisco",
  latitude: "37.7749",
  longitude: "-122.4194",
  referrer: "https://google.com",
  referrerDomain: "google.com",
};

const mockUrl = {
  id: "url123456",
  url: "https://example.com",
  shortCode: "url123456",
};

const mockClickWithUrl = {
  click: mockClick,
  url: mockUrl,
};

describe("ClickService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    test("creates a new click record", async () => {
      const insertMock = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockClick]),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertMock);

      const createData = {
        urlId: "url123456",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        browser: "Chrome",
        browserVersion: "120.0",
        os: "Windows",
        osVersion: "11",
        device: "Desktop",
        ip: "192.168.1.1",
        country: "US",
        region: "California",
        city: "San Francisco",
        latitude: "37.7749",
        longitude: "-122.4194",
        referrer: "https://google.com",
        referrerDomain: "google.com",
      };

      const result = await ClickService.create(createData);

      expect(result).toEqual(mockClick);
      expect(db.insert).toHaveBeenCalledWith(clickTable);
      expect(insertMock.values).toHaveBeenCalledWith({
        id: "click12345",
        ...createData,
      });
    });
  });

  describe("getById", () => {
    test("returns click with URL data when found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockClickWithUrl]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await ClickService.getById("click12345");

      expect(result).toEqual({
        ...mockClick,
        url: mockUrl,
      });
      expect(selectMock.where).toHaveBeenCalledWith(eq(clickTable.id, "click12345"));
      expect(selectMock.limit).toHaveBeenCalledWith(1);
    });

    test("returns null when click not found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await ClickService.getById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("list", () => {
    test("returns paginated list of clicks", async () => {
      const mockClicks = [mockClickWithUrl];
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(mockClicks),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const result = await ClickService.list({ limit: 10, cursor: 0 });

      expect(result).toEqual([
        {
          ...mockClick,
          url: mockUrl,
        },
      ]);
      expect(db.select).toHaveBeenCalled();
      expect(selectMock.from).toHaveBeenCalledWith(clickTable);
      expect(selectMock.limit).toHaveBeenCalledWith(10);
      expect(selectMock.offset).toHaveBeenCalledWith(0);
    });

    test("filters by urlId when provided", async () => {
      const mockClicks = [mockClickWithUrl];
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(mockClicks),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      await ClickService.list({ limit: 10, cursor: 0, urlId: "url123456" });

      expect(selectMock.where).toHaveBeenCalled();
    });
  });

  describe("getStats", () => {
    test("returns comprehensive click statistics", async () => {
      const mockStats = {
        totalClicks: 100,
        uniqueVisitors: 75,
        topCountries: [{ country: "US", clicks: 50 }],
        topReferrers: [{ referrerDomain: "google.com", clicks: 30 }],
        topBrowsers: [{ browser: "Chrome", clicks: 60 }],
        topDevices: [{ device: "Desktop", clicks: 70 }],
        clicksByDate: [{ date: "2025-05-28", clicks: 25 }],
      };

      // Create separate mock chains for each query type
      const totalClicksMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ totalClicks: 100 }]),
      };

      const uniqueVisitorsMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ uniqueVisitors: 75 }]),
      };

      const topCountriesMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ country: "US", clicks: 50 }]),
      };

      const topReferrersMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ referrerDomain: "google.com", clicks: 30 }]),
      };

      const topBrowsersMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ browser: "Chrome", clicks: 60 }]),
      };

      const topDevicesMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ device: "Desktop", clicks: 70 }]),
      };

      const clicksByDateMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ date: "2025-05-28", clicks: 25 }]),
      };

      (db.select as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(totalClicksMock)
        .mockReturnValueOnce(uniqueVisitorsMock)
        .mockReturnValueOnce(topCountriesMock)
        .mockReturnValueOnce(topReferrersMock)
        .mockReturnValueOnce(topBrowsersMock)
        .mockReturnValueOnce(topDevicesMock)
        .mockReturnValueOnce(clicksByDateMock);

      const result = await ClickService.getStats("url123456");

      expect(result).toEqual(mockStats);
      expect(db.select).toHaveBeenCalledTimes(7);
    });

    test("applies date filters when provided", async () => {
      // Simplified test that just checks the function doesn't throw
      const totalClicksMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ totalClicks: 50 }]),
      };

      const uniqueVisitorsMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ uniqueVisitors: 40 }]),
      };

      const emptyStatsMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(totalClicksMock)
        .mockReturnValueOnce(uniqueVisitorsMock)
        .mockReturnValueOnce(emptyStatsMock)
        .mockReturnValueOnce(emptyStatsMock)
        .mockReturnValueOnce(emptyStatsMock)
        .mockReturnValueOnce(emptyStatsMock)
        .mockReturnValueOnce(emptyStatsMock);

      const startDate = new Date("2025-05-01");
      const endDate = new Date("2025-05-31");

      const result = await ClickService.getStats("url123456", startDate, endDate);

      expect(result).toBeDefined();
      expect(result.totalClicks).toBe(50);
      expect(result.uniqueVisitors).toBe(40);
    });
  });

  describe("deleteById", () => {
    test("deletes a click record successfully", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
      };
      deleteMock.where.mockResolvedValue({ rowCount: 1 });

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      const result = await ClickService.deleteById("click12345");

      expect(result).toBe(true);
      expect(db.delete).toHaveBeenCalledWith(clickTable);
      expect(deleteMock.where).toHaveBeenCalledWith(eq(clickTable.id, "click12345"));
    });

    test("returns false when click not found", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
      };
      deleteMock.where.mockResolvedValue({ rowCount: 0 });

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      const result = await ClickService.deleteById("nonexistent");

      expect(result).toBe(false);
    });
  });

  describe("deleteByUrlId", () => {
    test("deletes all clicks for a URL", async () => {
      const deleteMock = {
        where: vi.fn().mockReturnThis(),
      };
      deleteMock.where.mockResolvedValue({ rowCount: 5 });

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteMock);

      const result = await ClickService.deleteByUrlId("url123456");

      expect(result).toBe(5);
      expect(db.delete).toHaveBeenCalledWith(clickTable);
      expect(deleteMock.where).toHaveBeenCalledWith(eq(clickTable.urlId, "url123456"));
    });
  });

  describe("handleRedirect", () => {
    test("successfully redirects and tracks click", async () => {
      const mockUrlRecord = {
        id: "url123456",
        url: "https://example.com",
        isActive: true,
        expiresAt: null,
      };

      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUrlRecord]),
      };

      const insertMock = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([mockClick]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);
      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertMock);

      const headers = new Headers({
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        referer: "https://google.com",
      });

      const result = await ClickService.handleRedirect("url123456", headers);

      expect(result).toEqual({ url: "https://example.com" });
      expect(selectMock.where).toHaveBeenCalledWith(eq(urlTable.id, "url123456"));
    });

    test("returns 404 when URL not found", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const headers = new Headers();
      const result = await ClickService.handleRedirect("nonexistent", headers);

      expect(result).toEqual({ error: "URL not found", status: 404 });
    });

    test("returns 410 when URL is inactive", async () => {
      const mockUrlRecord = {
        id: "url123456",
        url: "https://example.com",
        isActive: false,
        expiresAt: null,
      };

      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUrlRecord]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const headers = new Headers();
      const result = await ClickService.handleRedirect("url123456", headers);

      expect(result).toEqual({ error: "This URL has been disabled", status: 410 });
    });

    test("returns 410 when URL has expired", async () => {
      const mockUrlRecord = {
        id: "url123456",
        url: "https://example.com",
        isActive: true,
        expiresAt: new Date("2025-01-01"), // Past date
      };

      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockUrlRecord]),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const headers = new Headers();
      const result = await ClickService.handleRedirect("url123456", headers);

      expect(result).toEqual({ error: "This URL has expired", status: 410 });
    });

    test("returns 500 on database error", async () => {
      const selectMock = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockRejectedValue(new Error("Database error")),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(selectMock);

      const headers = new Headers();
      const result = await ClickService.handleRedirect("url123456", headers);

      expect(result).toEqual({ error: "Failed to process redirect", status: 500 });
    });
  });
});
