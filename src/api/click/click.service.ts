import { and, count, desc, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "~/db";
import {
  extractReferrerDomain,
  getClientIp,
  parseUserAgent,
  parseVercelGeoHeaders,
} from "~/utils/analytics";
import type { PaginationParams } from "../pagination";
import { urlTable } from "../url/url.sql";
import { clickTable } from "./click.sql";
import type { Click, ClickInfo, ClickStats, CreateClick } from "./click.types";

export namespace ClickService {
  /**
   * Serialize click data for API responses
   */
  function serialize(click: typeof clickTable.$inferSelect): Click {
    return {
      ...click,
      clickedAt: new Date(click.clickedAt),
    };
  }

  /**
   * Create a new click record
   */
  export async function create(data: CreateClick): Promise<Click> {
    const id = nanoid(10);
    const [click] = await db
      .insert(clickTable)
      .values({ id, ...data })
      .returning();

    return serialize(click);
  }

  /**
   * Get a click by ID
   */
  export async function getById(id: string): Promise<ClickInfo | null> {
    const [click] = await db
      .select({
        click: clickTable,
        url: {
          id: urlTable.id,
          url: urlTable.url,
          shortCode: urlTable.id,
        },
      })
      .from(clickTable)
      .leftJoin(urlTable, eq(clickTable.urlId, urlTable.id))
      .where(eq(clickTable.id, id))
      .limit(1);

    if (!click) return null;

    return {
      ...serialize(click.click),
      url: click.url || undefined,
    };
  }

  /**
   * List clicks with pagination
   */
  export async function list(
    params: PaginationParams & { urlId?: string },
  ): Promise<ClickInfo[]> {
    const { limit = 50, cursor, urlId } = params;

    const conditions = [];
    if (urlId) {
      conditions.push(eq(clickTable.urlId, urlId));
    }

    const clicks = await db
      .select({
        click: clickTable,
        url: {
          id: urlTable.id,
          url: urlTable.url,
          shortCode: urlTable.id,
        },
      })
      .from(clickTable)
      .leftJoin(urlTable, eq(clickTable.urlId, urlTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(clickTable.clickedAt))
      .limit(limit)
      .offset(cursor);

    return clicks.map((row) => ({
      ...serialize(row.click),
      url: row.url || undefined,
    }));
  }

  /**
   * Get click statistics for a URL
   */
  export async function getStats(
    urlId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ClickStats> {
    const conditions = [eq(clickTable.urlId, urlId)];

    if (startDate) {
      conditions.push(gte(clickTable.clickedAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(clickTable.clickedAt, endDate));
    }

    // Get total clicks
    const [{ totalClicks }] = await db
      .select({ totalClicks: count() })
      .from(clickTable)
      .where(and(...conditions));

    // Get unique visitors (by IP)
    const [{ uniqueVisitors }] = await db
      .select({ uniqueVisitors: count(sql`DISTINCT ${clickTable.ip}`) })
      .from(clickTable)
      .where(and(...conditions));

    // Get top countries
    const topCountries = await db
      .select({
        country: clickTable.country,
        clicks: count(),
      })
      .from(clickTable)
      .where(and(...conditions))
      .groupBy(clickTable.country)
      .orderBy(desc(count()))
      .limit(10);

    // Get top referrers
    const topReferrers = await db
      .select({
        referrerDomain: clickTable.referrerDomain,
        clicks: count(),
      })
      .from(clickTable)
      .where(and(...conditions, isNotNull(clickTable.referrerDomain)))
      .groupBy(clickTable.referrerDomain)
      .orderBy(desc(count()))
      .limit(10);

    // Get top browsers
    const topBrowsers = await db
      .select({
        browser: clickTable.browser,
        clicks: count(),
      })
      .from(clickTable)
      .where(and(...conditions))
      .groupBy(clickTable.browser)
      .orderBy(desc(count()))
      .limit(10);

    // Get top devices
    const topDevices = await db
      .select({
        device: clickTable.device,
        clicks: count(),
      })
      .from(clickTable)
      .where(and(...conditions))
      .groupBy(clickTable.device)
      .orderBy(desc(count()))
      .limit(10);

    // Get clicks by date
    const clicksByDate = await db
      .select({
        date: sql<string>`DATE(${clickTable.clickedAt})`,
        clicks: count(),
      })
      .from(clickTable)
      .where(and(...conditions))
      .groupBy(sql`DATE(${clickTable.clickedAt})`)
      .orderBy(sql`DATE(${clickTable.clickedAt})`)
      .limit(30);

    return {
      totalClicks,
      uniqueVisitors,
      topCountries,
      topReferrers,
      topBrowsers,
      topDevices,
      clicksByDate: clicksByDate.map((row) => ({
        date: row.date,
        clicks: row.clicks,
      })),
    };
  }

  /**
   * Delete a click record
   */
  export async function deleteById(id: string): Promise<boolean> {
    const result = await db.delete(clickTable).where(eq(clickTable.id, id));

    return result.rowCount > 0;
  }

  /**
   * Delete all clicks for a URL
   */
  export async function deleteByUrlId(urlId: string): Promise<number> {
    const result = await db.delete(clickTable).where(eq(clickTable.urlId, urlId));

    return result.rowCount;
  }

  /**
   * Handle URL redirect and track analytics
   */
  export async function handleRedirect(
    shortCode: string,
    headers: Headers,
  ): Promise<{ url: string } | { error: string; status: number }> {
    try {
      // Find the URL
      const [urlRecord] = await db
        .select()
        .from(urlTable)
        .where(eq(urlTable.id, shortCode))
        .limit(1);

      if (!urlRecord) {
        return { error: "URL not found", status: 404 };
      }

      if (!urlRecord.isActive) {
        return { error: "This URL has been disabled", status: 410 };
      }

      if (urlRecord.expiresAt && urlRecord.expiresAt < new Date()) {
        return { error: "This URL has expired", status: 410 };
      }

      // Track the click asynchronously (don't wait for it)
      trackClick(urlRecord.id, headers).catch(console.error);

      return { url: urlRecord.url };
    } catch {
      return { error: "Failed to process redirect", status: 500 };
    }
  }

  /**
   * Track click analytics
   * (Private helper function)
   */
  async function trackClick(urlId: string, headers: Headers): Promise<void> {
    try {
      const userAgent = headers.get("user-agent") || undefined;
      const referrer = headers.get("referer") || undefined;
      const ip = getClientIp(headers);
      const geo = parseVercelGeoHeaders(headers);
      const parsedUA = userAgent ? parseUserAgent(userAgent) : undefined;

      const clickData: CreateClick = {
        urlId,
        userAgent,
        browser: parsedUA?.browser,
        browserVersion: parsedUA?.browserVersion,
        os: parsedUA?.os,
        osVersion: parsedUA?.osVersion,
        device: parsedUA?.device,
        ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
        referrer,
        referrerDomain: referrer ? extractReferrerDomain(referrer) : null,
      };

      await create(clickData);
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  }
}
