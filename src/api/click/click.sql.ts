import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { urlTable } from "../url/url.sql";

export const clickTable = pgTable(
  "clicks",
  {
    id: varchar({ length: 10 }).primaryKey(),
    urlId: varchar({ length: 10 })
      .references(() => urlTable.id)
      .notNull(),
    clickedAt: timestamp().defaultNow().notNull(),
    userAgent: text(),
    browser: varchar({ length: 50 }),
    browserVersion: varchar({ length: 20 }),
    os: varchar({ length: 50 }),
    osVersion: varchar({ length: 20 }),
    device: varchar({ length: 50 }),
    country: varchar({ length: 2 }),
    region: varchar({ length: 255 }),
    city: varchar({ length: 255 }),
    latitude: varchar({ length: 20 }),
    longitude: varchar({ length: 20 }),
    referrer: text(),
    referrerDomain: varchar({ length: 255 }),
  },
  (table) => [
    index().on(table.urlId),
    index().on(table.clickedAt),
    index().on(table.country),
  ],
);

export const clickRelations = relations(clickTable, ({ one }) => ({
  url: one(urlTable, {
    fields: [clickTable.urlId],
    references: [urlTable.id],
  }),
}));
