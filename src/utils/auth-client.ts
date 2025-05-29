import { createAuthClient } from "better-auth/react";
import { apiKeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [apiKeyClient()],
});

export const { signIn, signUp, useSession, getSession } = authClient;
