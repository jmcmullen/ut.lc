import { desc, eq } from "drizzle-orm";
import { db } from "~/db";
import type { PaginationParams } from "../pagination";
import { urlTable } from "./url.sql";
import type { CreateUrl, UpdateUrl, Url } from "./url.types";

export namespace UrlService {
  /**
   * List URLs with pagination
   */
  export async function list({ limit, cursor }: PaginationParams): Promise<Url[]> {
    const rows = await db
      .select()
      .from(urlTable)
      .orderBy(desc(urlTable.createdAt))
      .limit(limit)
      .offset(cursor);

    return rows.map(serialize);
  }

  /**
   * Create a new shortened URL
   */
  export async function create(data: CreateUrl): Promise<Url> {
    const { id, ...values } = data;

    const [row] = await db
      .insert(urlTable)
      .values({
        ...values,
        ...(id && { id }), // Only include id if provided
      })
      .returning();

    return serialize(row);
  }

  /**
   * Update an existing URL
   */
  export async function update(id: string, data: UpdateUrl): Promise<Url> {
    const [row] = await db
      .update(urlTable)
      .set(data)
      .where(eq(urlTable.id, id))
      .returning();

    if (!row) {
      throw new Error(`URL with id ${id} not found`);
    }

    return serialize(row);
  }

  /**
   * Delete a URL
   */
  export async function remove(id: string): Promise<Url> {
    const [row] = await db.delete(urlTable).where(eq(urlTable.id, id)).returning();

    if (!row) {
      throw new Error(`URL with id ${id} not found`);
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
   * Check if a custom ID is available
   */
  export async function isIdAvailable(id: string): Promise<boolean> {
    const [existing] = await db
      .select({ id: urlTable.id })
      .from(urlTable)
      .where(eq(urlTable.id, id))
      .limit(1);

    return !existing;
  }

  /**
   * Serialize database row to API format
   */
  function serialize(row: typeof urlTable.$inferSelect): Url {
    return {
      id: row.id,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      url: row.url,
      isActive: row.isActive,
    };
  }
}
