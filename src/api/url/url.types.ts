import z from "zod/v4";
import { isValidShortCode } from "~/utils/shortcode";

export const UrlSchema = z.object({
  id: z.string().min(4).max(32).meta({
    example: "abc123xyz",
    description: "Unique short code identifier for the URL",
  }),
  createdAt: z.date().meta({
    example: "2025-05-28T16:34:14.123Z",
    description: "Timestamp when the URL was created",
  }),
  expiresAt: z.date().nullable().meta({
    example: "2025-06-28T16:34:14.123Z",
    description: "Optional expiration date for the URL",
  }),
  url: z.url("Must be a valid URL").meta({
    example: "https://example.com",
    description: "The original URL to be shortened",
  }),
  isActive: z.boolean().default(true).meta({
    example: true,
    description: "Whether the shortened URL is currently active",
  }),
});

export const CreateUrlSchema = UrlSchema.omit({
  id: true,
  createdAt: true,
  expiresAt: true,
  isActive: true,
}).extend({
  id: z
    .string()
    .min(4)
    .max(32)
    .refine(isValidShortCode, {
      message:
        "Invalid short code. Must be 4-32 characters and contain only letters, numbers, hyphens, and underscores.",
    })
    .optional()
    .meta({
      example: "custom-code",
      description: "Optional custom short code (auto-generated if not provided)",
    }),
  expiresAt: z.date().optional().meta({
    example: "2025-06-28T16:34:14.123Z",
    description: "Optional expiration date for the URL",
  }),
});

export const UpdateUrlSchema = UrlSchema.pick({
  url: true,
  isActive: true,
  expiresAt: true,
}).partial();

export type Url = z.infer<typeof UrlSchema>;
export type CreateUrl = z.infer<typeof CreateUrlSchema>;
export type UpdateUrl = z.infer<typeof UpdateUrlSchema>;
