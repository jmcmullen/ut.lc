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
          title: "Shortly API Docs",
          version: "1.0.0",
        },
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
  const { response } = await handler.handle(request, {
    prefix: "/api/v1",
    context: {},
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
