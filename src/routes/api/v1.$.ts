import { onError } from "@orpc/client";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { os } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import {
  experimental_ZodSmartCoercionPlugin as ZodSmartCoercionPlugin,
  experimental_ZodToJsonSchemaConverter as ZodToJsonSchemaConverter,
} from "@orpc/zod/zod4";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { auth } from "~/api/auth/auth";
import { clickRouter } from "~/api/click/click.router";
import { urlRouter } from "~/api/url/url.router";

const router = os.prefix("/api/v1").router({
  url: urlRouter,
  click: clickRouter,
});

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin(),
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "Ultra Tiny Link Creator API",
          version: "1.0.0",
          description: `API for URL shortening service with analytics.
          
Authentication Methods:
- **API Key**: Include your API key in the \`x-api-key\` header
- **Session Cookie**: For browser-based authentication`,
        },
        servers: [
          {
            url: "/api/v1",
            description: "API v1",
          },
        ],
        components: {
          securitySchemes: {
            apiKey: {
              type: "apiKey",
              in: "header",
              name: "x-api-key",
              description: "API Key authentication",
            },
            sessionAuth: {
              type: "apiKey",
              in: "cookie",
              name: "better-auth.session_token",
              description: "Session-based authentication",
            },
          },
        },
        security: [
          {
            apiKey: [],
          },
          {
            sessionAuth: [],
          },
        ],
      },
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

async function handle({ request }: { request: Request }) {
  // Better Auth automatically handles both session cookies and API keys
  // When x-api-key header is present, it validates the key and provides the associated user
  const session = await auth.api.getSession({ headers: request.headers });

  const { response } = await handler.handle(request, {
    prefix: "/api/v1",
    context: {
      user: session?.user || null,
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
