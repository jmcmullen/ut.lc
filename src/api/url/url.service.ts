import { and, desc, eq } from "drizzle-orm";
import { db } from "~/api/db";
import type { PaginationParams } from "../pagination";
import { urlTable } from "./url.sql";
import type { CreateUrl, UpdateUrl, Url } from "./url.types";

export namespace UrlService {
  /**
   * List URLs with pagination
   */
  export async function list(
    { limit, cursor }: PaginationParams,
    userId: string
  ): Promise<Url[]> {
    const rows = await db
      .select()
      .from(urlTable)
      .where(eq(urlTable.userId, userId))
      .orderBy(desc(urlTable.createdAt))
      .limit(limit)
      .offset(cursor);

    return rows.map(serialize);
  }

  /**
   * Create a new shortened URL
   */
  export async function create(data: CreateUrl, userId: string): Promise<Url> {
    const { slug, ...values } = data;

    const [row] = await db
      .insert(urlTable)
      .values({
        ...values,
        userId,
        ...(slug && { slug }), // Only include slug if provided
      })
      .returning();

    return serialize(row);
  }

  /**
   * Update an existing URL by slug
   */
  export async function update(
    slug: string,
    data: UpdateUrl,
    userId: string
  ): Promise<Url> {
    const [row] = await db
      .update(urlTable)
      .set(data)
      .where(and(eq(urlTable.slug, slug), eq(urlTable.userId, userId)))
      .returning();

    if (!row) {
      throw new Error(`URL with slug ${slug} not found or you don't have permission`);
    }

    return serialize(row);
  }

  /**
   * Delete a URL by slug
   */
  export async function remove(slug: string, userId: string): Promise<Url> {
    const [row] = await db
      .delete(urlTable)
      .where(and(eq(urlTable.slug, slug), eq(urlTable.userId, userId)))
      .returning();

    if (!row) {
      throw new Error(`URL with slug ${slug} not found or you don't have permission`);
    }

    return serialize(row);
  }

  /**
   * Find a URL by ID
   */
  export async function findById(id: string): Promise<Url | null> {
    const [row] = await db.select().from(urlTable).where(eq(urlTable.id, id)).limit(1);

    return row ? serialize(row) : null;
  }

  /**
   * Find a URL by slug
   */
  export async function findBySlug(slug: string): Promise<Url | null> {
    const [row] = await db.select().from(urlTable).where(eq(urlTable.slug, slug)).limit(1);

    return row ? serialize(row) : null;
  }

  /**
   * Check if a custom slug is available
   */
  export async function isSlugAvailable(slug: string): Promise<boolean> {
    const [existing] = await db
      .select({ slug: urlTable.slug })
      .from(urlTable)
      .where(eq(urlTable.slug, slug))
      .limit(1);

    return !existing;
  }

  /**
   * Serialize database row to API format
   */
  function serialize(row: typeof urlTable.$inferSelect): Url {
    return {
      id: row.id,
      slug: row.slug,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      url: row.url,
      isActive: row.isActive,
      userId: row.userId,
    };
  }
}
