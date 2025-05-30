/**
 * Vitest setup file for Node.js environment tests (API tests)
 * This file contains common mocks for database and other Node-specific modules
 */
import { vi } from "vitest";

// Mock environment variables for tests
// eslint-disable-next-line no-restricted-properties
process.env.DATABASE_URL =
  "postgresql://test:test@localhost:5432/test?sslmode=require";

// Mock database modules to prevent actual database connections during tests
vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => vi.fn()),
}));

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock("~/api/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));