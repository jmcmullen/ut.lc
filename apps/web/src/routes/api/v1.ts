import { createAPIFileRoute } from "@tanstack/react-start/api";
import { APIRoute as BaseAPIRoute } from "./v1.$";

export const APIRoute = createAPIFileRoute("/api/v1")(BaseAPIRoute.methods);
