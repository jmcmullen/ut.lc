import z from "zod/v4";

export const PaginationParams = z.object({
  limit: z.number().int().min(1).max(100).default(100),
  cursor: z.number().int().min(0).default(0),
});

export type PaginationParams = z.infer<typeof PaginationParams>;
