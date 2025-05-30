import { typeid } from "typeid-js";

export const prefixes = {
  account: "acc",
  apikey: "key",
  click: "clk",
  session: "ses",
  url: "url",
  user: "usr",
  verification: "ver",
} as const;

export function createId(prefix: keyof typeof prefixes): string {
  return typeid(prefixes[prefix]).toString();
}

export function isValidId(prefix: keyof typeof prefixes, id: string): boolean {
  return id.startsWith(prefixes[prefix]) && id.length === 30;
}
