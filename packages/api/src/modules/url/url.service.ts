import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@utlc/db/client";
import * as schema from "@utlc/db/schema";

import type { PaginationParams } from "../../pagination";
import type { CreateUrl, UpdateUrl, Url } from "./url.types";

export namespace UrlService {
  /**
   * List URLs with pagination
   */
  export async function list(
    { limit, cursor }: PaginationParams,
    userId: string,
  ): Promise<Url[]> {
    const rows = await db
      .select()
      .from(schema.url)
      .where(eq(schema.url.userId, userId))
      .orderBy(desc(schema.url.createdAt))
      .limit(limit)
      .offset(cursor);

    return rows.map(serialize);
  }

  /**
   * Create a new shortened URL
   */
  export async function create(data: CreateUrl, userId: string): Promise<Url> {
    const { slug, ...values } = data;

    // Check if custom slug is available before inserting
    if (slug) {
      const isAvailable = await isSlugAvailable(slug);
      if (!isAvailable) {
        throw new ORPCError("CONFLICT", {
          message: `Slug '${slug}' is already taken. Please choose a different slug.`,
        });
      }
    }

    const [row] = await db
      .insert(schema.url)
      .values({
        ...values,
        userId,
        ...(slug && { slug }), // Only include slug if provided
      })
      .returning();

    if (!row) {
      throw new ORPCError("NOT_FOUND", {
        message: `Unable to create URL`,
      });
    }

    return serialize(row);
  }

  /**
   * Update an existing URL by ID
   */
  export async function update(
    id: string,
    data: UpdateUrl,
    userId: string,
  ): Promise<Url> {
    // Check if custom slug is available before updating (if slug is being changed)
    if (data.slug) {
      const isAvailable = await isSlugAvailable(data.slug);
      if (!isAvailable) {
        throw new ORPCError("CONFLICT", {
          message: `Slug '${data.slug}' is already taken. Please choose a different slug.`,
        });
      }
    }

    const [row] = await db
      .update(schema.url)
      .set(data)
      .where(and(eq(schema.url.id, id), eq(schema.url.userId, userId)))
      .returning();

    if (!row) {
      throw new ORPCError("NOT_FOUND", {
        message: `Unable to update URL with id ${id}`,
      });
    }

    return serialize(row);
  }

  /**
   * Delete a URL by ID
   */
  export async function remove(id: string, userId: string): Promise<Url> {
    const [row] = await db
      .delete(schema.url)
      .where(and(eq(schema.url.id, id), eq(schema.url.userId, userId)))
      .returning();

    if (!row) {
      throw new ORPCError("NOT_FOUND", {
        message: `Unable to delete URL with id ${id}`,
      });
    }

    return serialize(row);
  }

  /**
   * Find a URL by ID
   */
  export async function findById(id: string): Promise<Url | null> {
    const [row] = await db
      .select()
      .from(schema.url)
      .where(eq(schema.url.id, id))
      .limit(1);

    return row ? serialize(row) : null;
  }

  /**
   * Find a URL by slug
   */
  export async function findBySlug(slug: string): Promise<Url | null> {
    const [row] = await db
      .select()
      .from(schema.url)
      .where(eq(schema.url.slug, slug))
      .limit(1);

    return row ? serialize(row) : null;
  }

  /**
   * Check if a custom slug is available
   */
  export async function isSlugAvailable(slug: string): Promise<boolean> {
    const [existing] = await db
      .select({ slug: schema.url.slug })
      .from(schema.url)
      .where(eq(schema.url.slug, slug))
      .limit(1);

    return !existing;
  }

  /**
   * Serialize database row to API format
   */
  function serialize(row: typeof schema.url.$inferSelect): Url {
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
