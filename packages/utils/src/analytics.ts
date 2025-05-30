import { UAParser } from "ua-parser-js";

// Types for Vercel's geo data
export interface VercelGeo {
  city?: string;
  country?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
}

// Types for parsed user agent data
export interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: "desktop" | "mobile" | "tablet" | "unknown";
}

// Analytics data collected on each click
export interface ClickAnalytics {
  userAgent?: string;
  ip?: string;
  geo?: VercelGeo;
  referrer?: string;
  parsedUA?: ParsedUserAgent;
}

// Aggregated stats for a URL
export interface UrlStats {
  totalClicks: number;
  clicksByCountry: Record<string, number>;
  clicksByDevice: Record<string, number>;
  clicksByBrowser: Record<string, number>;
  clicksByDate: Record<string, number>;
  recentClicks: {
    clickedAt: Date;
    country?: string;
    city?: string;
    device?: string;
  }[];
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let device: "desktop" | "mobile" | "tablet" | "unknown" = "unknown";
  if (result.device.type === "mobile") {
    device = "mobile";
  } else if (result.device.type === "tablet") {
    device = "tablet";
  } else if (result.os.name && !result.device.type) {
    device = "desktop";
  }

  return {
    browser: result.browser.name ?? "Unknown",
    browserVersion: result.browser.version ?? "Unknown",
    os: result.os.name ?? "Unknown",
    osVersion: result.os.version ?? "Unknown",
    device,
  };
}

export function extractReferrerDomain(referrer: string): string | null {
  if (!referrer) return null;

  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return null;
  }
}

// Since @vercel/geo doesn't exist as a package, we'll parse geo data from headers
// Vercel automatically adds these headers to requests
export function parseVercelGeoHeaders(headers: Headers): VercelGeo {
  return {
    city: headers.get("x-vercel-ip-city") ?? undefined,
    country: headers.get("x-vercel-ip-country") ?? undefined,
    region: headers.get("x-vercel-ip-country-region") ?? undefined,
    latitude: headers.get("x-vercel-ip-latitude") ?? undefined,
    longitude: headers.get("x-vercel-ip-longitude") ?? undefined,
  };
}

// Get client IP from various headers
export function getClientIp(headers: Headers): string | undefined {
  // Check various headers in order of preference
  const ipHeaders = [
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
    "x-cluster-client-ip",
    "cf-connecting-ip",
    "fastly-client-ip",
    "true-client-ip",
    "x-forwarded",
    "forwarded-for",
    "forwarded",
  ];

  for (const header of ipHeaders) {
    const value = headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(",")[0]?.trim();
      if (ip) return ip;
    }
  }

  return undefined;
}
