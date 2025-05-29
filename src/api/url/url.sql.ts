import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "~/utils/id";
import { generateShortCode } from "~/utils/shortcode";
import { user } from "../auth/auth.sql";
import { clickTable } from "../click/click.sql";

export const urlTable = pgTable("urls", {
  id: text()
    .$default(() => createId("url"))
    .primaryKey(),
  slug: varchar({ length: 32 })
    .$default(() => generateShortCode())
    .notNull()
    .unique(),
  createdAt: timestamp().defaultNow().notNull(),
  expiresAt: timestamp(),
  url: text().notNull(),
  isActive: boolean().default(true).notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const urlRelations = relations(urlTable, ({ many, one }) => ({
  clicks: many(clickTable),
  user: one(user, {
    fields: [urlTable.userId],
    references: [user.id],
  }),
}));
