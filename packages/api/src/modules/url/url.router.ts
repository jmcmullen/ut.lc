import { z } from "zod/v4";

import { PaginationParams } from "../../pagination";
import { authProcedure } from "../../procedures";
import { UrlService } from "./url.service";
import { CreateUrlSchema, UpdateUrlSchema, UrlSchema } from "./url.types";

const list = authProcedure
  .route({
    method: "GET",
    path: "/url",
    summary: "List shortened URLs",
    description:
      "Retrieve a paginated list of shortened URLs. Supports pagination through limit and cursor parameters to efficiently browse through large datasets.",
    tags: ["URL"],
  })
  .input(PaginationParams)
  .output(z.array(UrlSchema))
  .handler(({ input, context }) => UrlService.list(input, context.user.id));

const create = authProcedure
  .route({
    method: "POST",
    path: "/url",
    summary: "Create a shortened URL",
    description:
      "Create a new shortened URL with an optional custom ID. If no ID is provided, a unique short code will be automatically generated. The URL must be valid and the custom ID (if provided) must be between 7-10 characters.",
    tags: ["URL"],
  })
  .input(CreateUrlSchema)
  .output(UrlSchema)
  .handler(({ input, context }) => UrlService.create(input, context.user.id));

const update = authProcedure
  .route({
    method: "PATCH",
    path: "/url/{id}",
    summary: "Update a shortened URL",
    description:
      "Update an existing shortened URL's properties. You can modify the target URL, slug, active status, and expiration date. The URL ID cannot be changed.",
    tags: ["URL"],
  })
  .input(
    z.object({
      id: z.string(),
      data: UpdateUrlSchema,
    }),
  )
  .output(UrlSchema)
  .handler(({ input, context }) =>
    UrlService.update(input.id, input.data, context.user.id),
  );

const remove = authProcedure
  .route({
    method: "DELETE",
    path: "/url/{id}",
    summary: "Delete a shortened URL",
    description:
      "Permanently delete a shortened URL. This action cannot be undone and will also remove all associated click analytics data.",
    tags: ["URL"],
  })
  .input(z.object({ id: z.string() }))
  .output(UrlSchema)
  .handler(({ input, context }) =>
    UrlService.remove(input.id, context.user.id),
  );

export const urlRouter = {
  list,
  create,
  update,
  remove,
};
