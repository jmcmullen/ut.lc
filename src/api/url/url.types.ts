import z from "zod/v4";
import { isValidShortCode } from "~/utils/shortcode";

export const UrlSchema = z.object({
  id: z.string().startsWith("url_").meta({
    example: "url_01JRQW65QRY01JMHXG0N8XEWVH",
    description: "Unique prefixed identifier for the URL",
  }),
  slug: z.string().min(4).max(32).meta({
    example: "abc123xyz",
    description: "Short code slug for the URL",
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
  userId: z.string().meta({
    example: "usr_01JRQW65QRY01JMHXG0N8XEWVH",
    description: "ID of the user who owns this URL",
  }),
});

export const CreateUrlSchema = UrlSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  expiresAt: true,
  isActive: true,
  userId: true,
}).extend({
  slug: z
    .string()
    .min(0)
    .or(z.string().min(4).max(32))
    .optional()
    .refine((code) => !code || isValidShortCode(code), {
      message:
        "Invalid short code. Must be 4-32 characters and contain only letters, numbers, hyphens, and underscores.",
    })
    .meta({
      example: "custom-code",
      description: "Optional custom slug (auto-generated if not provided)",
    }),
  expiresAt: z.coerce.date().optional().meta({
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
