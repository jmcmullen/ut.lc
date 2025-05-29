import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, openAPI } from "better-auth/plugins";
import { createId, prefixes } from "~/utils/id";
import { db } from "../db";

export const auth = betterAuth({
  appName: "UT.LC",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    cookiePrefix: "utlc",
    database: {
      generateId: (options) => {
        const table = typeof options === "string" ? options : options.model;
        return createId(table as keyof typeof prefixes);
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [apiKey(), openAPI({ disableDefaultReference: true })],
});
