import { createMiddleware } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { getSession } from "~/utils/auth-client";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { data: session } = await getSession({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  });
  return await next({
    context: {
      user: session?.user,
    },
  });
});
