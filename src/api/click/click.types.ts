import { z } from "zod/v4";

export const ClickSchema = z.object({
  id: z.string().max(10).describe("Unique identifier for the click"),
  urlId: z.string().min(4).max(32).describe("ID of the URL that was clicked"),
  clickedAt: z.date().describe("Timestamp when the click occurred"),
  userAgent: z.string().nullish().describe("User agent string from the browser"),
  browser: z.string().max(50).nullish().describe("Browser name"),
  browserVersion: z.string().max(20).nullish().describe("Browser version"),
  os: z.string().max(50).nullish().describe("Operating system"),
  osVersion: z.string().max(20).nullish().describe("Operating system version"),
  device: z.string().max(50).nullish().describe("Device type"),
  ipHash: z
    .string()
    .max(64)
    .nullish()
    .describe("Hashed IP address for privacy-safe unique visitor counting"),
  country: z.string().length(2).nullish().describe("Country code (ISO 3166-1 alpha-2)"),
  region: z.string().max(255).nullish().describe("Region/state name"),
  city: z.string().max(255).nullish().describe("City name"),
  latitude: z.string().nullish().describe("Latitude coordinate"),
  longitude: z.string().nullish().describe("Longitude coordinate"),
  referrer: z.string().nullish().describe("Referrer URL"),
  referrerDomain: z.string().max(255).nullish().describe("Referrer domain"),
});

export const CreateClickSchema = ClickSchema.omit({
  id: true,
  clickedAt: true,
});

export const ClickInfoSchema = ClickSchema.extend({
  url: z
    .object({
      id: z.string().min(4).max(32),
      url: z.string(),
      shortCode: z.string().min(4).max(32),
    })
    .optional(),
});

export const ClickStatsSchema = z.object({
  totalClicks: z.number().describe("Total number of clicks"),
  uniqueVisitors: z.number().describe("Number of unique visitors (by hashed IP)"),
  topCountries: z
    .array(
      z.object({
        country: z.string().nullable(),
        clicks: z.number(),
      }),
    )
    .describe("Top countries by click count"),
  topReferrers: z
    .array(
      z.object({
        referrerDomain: z.string().nullable(),
        clicks: z.number(),
      }),
    )
    .describe("Top referrer domains"),
  topBrowsers: z
    .array(
      z.object({
        browser: z.string().nullable(),
        clicks: z.number(),
      }),
    )
    .describe("Top browsers"),
  topDevices: z
    .array(
      z.object({
        device: z.string().nullable(),
        clicks: z.number(),
      }),
    )
    .describe("Top device types"),
  clicksByDate: z
    .array(
      z.object({
        date: z.string(),
        clicks: z.number(),
      }),
    )
    .describe("Click counts by date"),
});

export type Click = z.infer<typeof ClickSchema>;
export type CreateClick = z.infer<typeof CreateClickSchema>;
export type ClickInfo = z.infer<typeof ClickInfoSchema>;
export type ClickStats = z.infer<typeof ClickStatsSchema>;
