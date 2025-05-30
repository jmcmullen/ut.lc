import { createServerFn } from "@tanstack/react-start";
import {
  cleanuriErrorResponseSchema,
  cleanuriOkResponseSchema,
  cleanuriRequestSchema,
} from "~/schemas/cleanuriSchemas";

export const API_URL = "https://cleanuri.com/api/v1/shorten";

export const handleForm = createServerFn({ method: "POST" })
  .validator((data) => cleanuriRequestSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const formData = new FormData();
      formData.append("url", data.url);
      const params = new URLSearchParams();
      params.append("url", data.url);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        return await response
          .json()
          .then((resp) => cleanuriErrorResponseSchema.parse(resp));
      }

      return await response.json().then((resp) =>
        cleanuriOkResponseSchema.parse({
          ...resp,
          originalUrl: data.url,
        }),
      );
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  });
