import { ORPCError, os } from "@orpc/server";
import type { User } from "better-auth";
import type { APIContext } from "./context";

export const publicProcedure = os.$context<APIContext>();

export const authProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Please provide a valid api key",
    });
  }

  return next({
    context: {
      ...context,
      user: context.user as User,
    },
  });
});
