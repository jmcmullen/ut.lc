import { relations } from "drizzle-orm";
import { index, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "~/utils/id";
import { urlTable } from "../url/url.sql";

export const clickTable = pgTable(
  "clicks",
  {
    id: text()
      .$default(() => createId("click"))
      .primaryKey(),
    urlId: text()
      .references(() => urlTable.id)
      .notNull(),
    clickedAt: timestamp().defaultNow().notNull(),
    userAgent: text(),
    browser: varchar({ length: 50 }),
    browserVersion: varchar({ length: 20 }),
    os: varchar({ length: 50 }),
    osVersion: varchar({ length: 20 }),
    device: varchar({ length: 50 }),
    ipHash: varchar({ length: 64 }),
    country: varchar({ length: 2 }),
    region: varchar({ length: 255 }),
    city: varchar({ length: 255 }),
    latitude: numeric({ precision: 10, scale: 8 }),
    longitude: numeric({ precision: 11, scale: 8 }),
    referrer: text(),
    referrerDomain: varchar({ length: 255 }),
  },
  (table) => [
    index().on(table.urlId),
    index().on(table.clickedAt),
    index().on(table.country),
    index().on(table.ipHash),
  ],
);

export const clickRelations = relations(clickTable, ({ one }) => ({
  url: one(urlTable, {
    fields: [clickTable.urlId],
    references: [urlTable.id],
  }),
}));
