import { z } from "zod/v4";

const urlSchema = z
  .url()
  .includes(".", { message: "Invalid URL" })
  .min(1, { message: "Please add a link" })
  .transform((url) => encodeURI(url.trim()));

export const cleanuriRequestSchema = z.object({
  url: urlSchema,
});

export const cleanuriOkResponseSchema = z
  .object({
    result_url: z.string(),
    originalUrl: z.string(),
  })
  .transform((v) => ({
    resultUrl: v.result_url,
    originalUrl: v.originalUrl,
  }));

export const cleanuriErrorResponseSchema = z
  .object({
    error: z.string(),
  })
  .transform((v) => ({
    error: v.error,
  }));

export type CleanuriRequest = z.infer<typeof cleanuriRequestSchema>;
export type CleanuriOkResponse = z.infer<typeof cleanuriOkResponseSchema>;
export type CleanuriErrorResponse = z.infer<typeof cleanuriErrorResponseSchema>;
