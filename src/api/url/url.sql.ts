import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { generateShortCode } from "~/utils/shortcode";
import { clickTable } from "../click/click.sql";

export const urlTable = pgTable("urls", {
  id: varchar({ length: 10 })
    .$default(() => generateShortCode())
    .primaryKey(),
  createdAt: timestamp().defaultNow().notNull(),
  expiresAt: timestamp(),
  url: text().notNull(),
  isActive: boolean().default(true).notNull(),
});

export const urlRelations = relations(urlTable, ({ many }) => ({
  clicks: many(clickTable),
}));
