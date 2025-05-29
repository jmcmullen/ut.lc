import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, openAPI } from "better-auth/plugins";
import { createId } from "~/utils/id";
import { db } from "../db";

export const auth = betterAuth({
  appName: "UT.LC",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    database: {
      generateId: (options) => {
        const table = typeof options === "string" ? options : options.model;

        // Map Better Auth table names to our prefix keys
        const prefixMap: Record<string, Parameters<typeof createId>[0]> = {
          user: "user",
          session: "session",
          account: "account",
          verification: "verification",
          apikey: "apiKey",
        };

        const prefix = prefixMap[table];
        if (!prefix) {
          // Fallback for any unknown tables
          return createId("user");
        }

        return createId(prefix);
      },
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
