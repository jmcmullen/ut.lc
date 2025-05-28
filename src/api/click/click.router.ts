import { os } from "@orpc/server";
import { z } from "zod/v4";
import { PaginationParams } from "../pagination";
import { ClickService } from "./click.service";
import { ClickInfoSchema, ClickStatsSchema } from "./click.types";

const list = os
  .route({
    method: "GET",
    path: "/click",
    summary: "List clicks",
    description:
      "Retrieve a paginated list of clicks with optional filtering by URL. Supports pagination through limit and cursor parameters to efficiently browse through large click datasets.",
    tags: ["Click"],
  })
  .input(PaginationParams.extend({ urlId: z.string().optional() }))
  .output(z.array(ClickInfoSchema))
  .handler(({ input }) => ClickService.list(input));

const getById = os
  .route({
    method: "GET",
    path: "/click/{id}",
    summary: "Get click by ID",
    description:
      "Retrieve a specific click record by its unique identifier. Returns detailed information about the click including associated URL data.",
    tags: ["Click"],
  })
  .input(z.object({ id: z.string() }))
  .output(ClickInfoSchema.nullable())
  .handler(({ input }) => ClickService.getById(input.id));

const stats = os
  .route({
    method: "GET",
    path: "/click/stats/{urlId}",
    summary: "Get click statistics",
    description:
      "Retrieve comprehensive analytics and statistics for clicks on a specific URL. Includes metrics like total clicks, unique visitors, geographic data, device information, and referrer analysis.",
    tags: ["Click"],
  })
  .input(
    z.object({
      urlId: z.string(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }),
  )
  .output(ClickStatsSchema)
  .handler(({ input }) =>
    ClickService.getStats(input.urlId, input.startDate, input.endDate),
  );

const deleteById = os
  .route({
    method: "DELETE",
    path: "/click/{id}",
    summary: "Delete click",
    description:
      "Delete a specific click record by its ID. This action is permanent and cannot be undone.",
    tags: ["Click"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.boolean())
  .handler(({ input }) => ClickService.deleteById(input.id));

const deleteByUrlId = os
  .route({
    method: "DELETE",
    path: "/click/url/{urlId}",
    summary: "Delete clicks by URL",
    description:
      "Delete all click records associated with a specific URL. This action is permanent and cannot be undone. Returns the number of deleted records.",
    tags: ["Click"],
  })
  .input(z.object({ urlId: z.string() }))
  .output(z.number())
  .handler(({ input }) => ClickService.deleteByUrlId(input.urlId));

export const clickRouter = {
  list,
  getById,
  stats,
  deleteById,
  deleteByUrlId,
};
