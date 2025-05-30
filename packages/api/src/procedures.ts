import { ORPCError, os } from "@orpc/server";

import type { APIContext } from "./context";

const authMiddleware = os
  .$context<APIContext>()
  .middleware(({ context, next }) => {
    if (!context.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Please provide a valid api key",
      });
    }

    return next({
      context: {
        ...context,
        user: context.user,
      },
    });
  });

export const publicProcedure = os.$context<APIContext>();
export const authProcedure = publicProcedure.use(authMiddleware);
