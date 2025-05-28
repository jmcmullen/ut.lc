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
  recentClicks: Array<{
    clickedAt: Date;
    country?: string;
    city?: string;
    device?: string;
  }>;
}
