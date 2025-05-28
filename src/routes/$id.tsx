import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { ClickService } from "~/api/click";
import { UrlSchema } from "~/api/url";

// Server function to handle redirect
const getRedirectUrl = createServerFn({ method: "GET" })
  .validator((data) => UrlSchema.pick({ id: true }).parse(data))
  .handler(async ({ data }) => {
    console.log("data", JSON.stringify(data, null, 2));
    const request = getWebRequest();
    if (!request) {
      return { error: "Request not found", status: 404 };
    }

    const headers = request.headers;

    const result = await ClickService.handleRedirect(data.id, headers);

    if ("error" in result) {
      return { error: result.error, status: result.status };
    }

    return { url: result.url };
  });

export const Route = createFileRoute("/$id")({
  beforeLoad: async ({ params, context }) => {
    const { id } = params;

    console.log("id", JSON.stringify({ id, context }, null, 2));

    // Get redirect URL from server
    const result = await getRedirectUrl({ data: { id } });

    if ("error" in result) {
      // Redirect to home page with error
      throw redirect({
        to: "/",
        search: {
          error: result.error,
        },
      });
    }

    // Perform the actual redirect
    throw redirect({
      href: result.url,
      reloadDocument: true, // This ensures a full page redirect
    });
  },
  component: () => null, // This will never render due to redirects
});
