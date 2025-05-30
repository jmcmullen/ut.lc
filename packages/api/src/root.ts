import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError, os } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";

import type { APIContext } from "./context";
import { clickRouter } from "./modules/click";
import { urlRouter } from "./modules/url";

const router = os.$context<APIContext>().prefix("/api/v1").router({
  url: urlRouter,
  click: clickRouter,
});

export const handler = new OpenAPIHandler(router, {
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
              name: "utlc.session_token",
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
