import type { User } from "better-auth";

export interface APIContext {
  user: User | null;
}