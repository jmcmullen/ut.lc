import { createAPIFileRoute } from "@tanstack/react-start/api";

import { auth } from "@utlc/auth/config";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => {
    return auth.handler(request);
  },
  POST: ({ request }) => {
    return auth.handler(request);
  },
});
