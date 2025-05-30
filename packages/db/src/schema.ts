import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createId } from "@utlc/utils/id";
import { generateShortCode } from "@utlc/utils/shortcode";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const apikey = pgTable("apikey", {
  id: text("id").primaryKey(),
  name: text("name"),
  start: text("start"),
  prefix: text("prefix"),
  key: text("key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  lastRefillAt: timestamp("last_refill_at"),
  enabled: boolean("enabled").default(true),
  rateLimitEnabled: boolean("rate_limit_enabled").default(true),
  rateLimitTimeWindow: integer("rate_limit_time_window").default(86400000),
  rateLimitMax: integer("rate_limit_max").default(10),
  requestCount: integer("request_count"),
  remaining: integer("remaining"),
  lastRequest: timestamp("last_request"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  permissions: text("permissions"),
  metadata: text("metadata"),
});

export const click = pgTable(
  "clicks",
  {
    id: text()
      .$default(() => createId("click"))
      .primaryKey(),
    urlId: text()
      .references(() => url.id)
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

export const clickRelations = relations(click, ({ one }) => ({
  url: one(url, {
    fields: [click.urlId],
    references: [url.id],
  }),
}));

export const url = pgTable("urls", {
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

export const urlRelations = relations(url, ({ many, one }) => ({
  clicks: many(click),
  user: one(user, {
    fields: [url.userId],
    references: [user.id],
  }),
}));
