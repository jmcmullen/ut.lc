import { createHash } from "node:crypto";
import { ORPCError } from "@orpc/server";
import { and, count, desc, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@utlc/db/client";
import * as schema from "@utlc/db/schema";
import {
  extractReferrerDomain,
  getClientIp,
  parseUserAgent,
  parseVercelGeoHeaders,
} from "@utlc/utils/analytics";

import type { PaginationParams } from "./click.router";
import type { Click, ClickInfo, ClickStats, CreateClick } from "./click.types";

export namespace ClickService {
  /**
   * Hash an IP address for privacy-safe storage
   */
  function hashIp(ip: string | null): string | null {
    if (!ip) return null;
    return createHash("sha256").update(ip).digest("hex");
  }

  /**
   * Serialize click data for API responses
   */
  function serialize(click: typeof schema.click.$inferSelect): Click {
    return {
      ...click,
      clickedAt: new Date(click.clickedAt),
      latitude: click.latitude ? click.latitude.toString() : null,
      longitude: click.longitude ? click.longitude.toString() : null,
    };
  }

  /**
   * Create a new click record
   */
  export async function create(data: CreateClick): Promise<Click> {
    const id = nanoid(10);
    const [click] = await db
      .insert(schema.click)
      .values({ id, ...data })
      .returning();

    if (!click) {
      throw new ORPCError("NOT_FOUND", {
        message: `Unable to create click`,
      });
    }

    return serialize(click);
  }

  /**
   * Get a click by ID
   */
  export async function getById(id: string): Promise<ClickInfo | null> {
    const [click] = await db
      .select({
        click: schema.click,
        url: {
          id: schema.url.id,
          url: schema.url.url,
          shortCode: schema.url.id,
        },
      })
      .from(schema.click)
      .leftJoin(schema.url, eq(schema.click.urlId, schema.url.id))
      .where(eq(schema.click.id, id))
      .limit(1);

    if (!click) return null;

    return {
      ...serialize(click.click),
      url: click.url ?? undefined,
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
      conditions.push(eq(schema.click.urlId, urlId));
    }

    const clicks = await db
      .select({
        click: schema.click,
        url: {
          id: schema.url.id,
          url: schema.url.url,
          shortCode: schema.url.id,
        },
      })
      .from(schema.click)
      .leftJoin(schema.url, eq(schema.click.urlId, schema.url.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(schema.click.clickedAt))
      .limit(limit)
      .offset(cursor);

    return clicks.map((row) => ({
      ...serialize(row.click),
      url: row.url ?? undefined,
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
    const conditions = [eq(schema.click.urlId, urlId)];

    if (startDate) {
      conditions.push(gte(schema.click.clickedAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(schema.click.clickedAt, endDate));
    }

    // Get total clicks
    const totalClicksResult = await db
      .select({ totalClicks: count() })
      .from(schema.click)
      .where(and(...conditions));
    const totalClicks = totalClicksResult[0]?.totalClicks ?? 0;

    // Get unique visitors (by hashed IP)
    const uniqueVisitorsResult = await db
      .select({ uniqueVisitors: count(sql`DISTINCT ${schema.click.ipHash}`) })
      .from(schema.click)
      .where(and(...conditions));
    const uniqueVisitors = uniqueVisitorsResult[0]?.uniqueVisitors ?? 0;

    // Get top countries
    const topCountries = await db
      .select({
        country: schema.click.country,
        clicks: count(),
      })
      .from(schema.click)
      .where(and(...conditions))
      .groupBy(schema.click.country)
      .orderBy(desc(count()))
      .limit(10);

    // Get top referrers
    const topReferrers = await db
      .select({
        referrerDomain: schema.click.referrerDomain,
        clicks: count(),
      })
      .from(schema.click)
      .where(and(...conditions, isNotNull(schema.click.referrerDomain)))
      .groupBy(schema.click.referrerDomain)
      .orderBy(desc(count()))
      .limit(10);

    // Get top browsers
    const topBrowsers = await db
      .select({
        browser: schema.click.browser,
        clicks: count(),
      })
      .from(schema.click)
      .where(and(...conditions))
      .groupBy(schema.click.browser)
      .orderBy(desc(count()))
      .limit(10);

    // Get top devices
    const topDevices = await db
      .select({
        device: schema.click.device,
        clicks: count(),
      })
      .from(schema.click)
      .where(and(...conditions))
      .groupBy(schema.click.device)
      .orderBy(desc(count()))
      .limit(10);

    // Get clicks by date
    const clicksByDate = await db
      .select({
        date: sql<string>`DATE(${schema.click.clickedAt})`,
        clicks: count(),
      })
      .from(schema.click)
      .where(and(...conditions))
      .groupBy(sql`DATE(${schema.click.clickedAt})`)
      .orderBy(sql`DATE(${schema.click.clickedAt})`)
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
    const result = await db.delete(schema.click).where(eq(schema.click.id, id));

    return result.rowCount > 0;
  }

  /**
   * Delete all clicks for a URL
   */
  export async function deleteByUrlId(urlId: string): Promise<number> {
    const result = await db
      .delete(schema.click)
      .where(eq(schema.click.urlId, urlId));

    return result.rowCount;
  }

  /**
   * Handle URL redirect and track analytics
   */
  export async function handleRedirect(
    slug: string,
    headers: Headers,
  ): Promise<{ url: string } | { error: string; status: number }> {
    try {
      // Find the URL by slug
      const [urlRecord] = await db
        .select()
        .from(schema.url)
        .where(eq(schema.url.slug, slug))
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
      const userAgent = headers.get("user-agent") ?? undefined;
      const referrer = headers.get("referer") ?? undefined;
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
        ipHash: hashIp(ip ?? null),
        country: geo.country,
        region: geo.region,
        city: geo.city,
        latitude: geo.latitude ?? null,
        longitude: geo.longitude ?? null,
        referrer,
        referrerDomain: referrer ? extractReferrerDomain(referrer) : null,
      };

      await create(clickData);
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  }
}
