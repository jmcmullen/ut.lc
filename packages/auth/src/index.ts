import { apiKeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "../env";

export const auth = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [apiKeyClient()],
});

export type { User } from "better-auth";
