import { createAPIFileRoute } from "@tanstack/react-start/api";

import { handler } from "@utlc/api/root";
import { auth } from "@utlc/auth/config";

async function handle({ request }: { request: Request }) {
  const session = await auth.api.getSession({ headers: request.headers });

  const { response } = await handler.handle(request, {
    prefix: "/api/v1",
    context: {
      user: session?.user,
    },
  });

  return response ?? new Response("Not Found :(", { status: 404 });
}

export const APIRoute = createAPIFileRoute("/api/v1/$")({
  HEAD: handle,
  GET: handle,
  POST: handle,
  PUT: handle,
  PATCH: handle,
  DELETE: handle,
});
