import { registerGlobalMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "./utils/auth-middleware";

registerGlobalMiddleware({
  middleware: [authMiddleware],
});
