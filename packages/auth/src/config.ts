import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, openAPI } from "better-auth/plugins";

import type { prefixes } from "@utlc/utils/id";
import { db } from "@utlc/db/client";
import { createId } from "@utlc/utils/id";

import { env } from "../env";

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
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [apiKey(), openAPI({ disableDefaultReference: true })],
});
