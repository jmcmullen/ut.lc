import { customAlphabet } from "nanoid";

// Custom alphabet without similar looking characters (0, O, I, l)
// This helps avoid confusion when users type URLs manually
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// Generate a 7-character short code by default
export const generateShortCode = customAlphabet(alphabet, 7);

// Validate if a string is a valid short code
export function isValidShortCode(code: string): boolean {
  if (!code || code.length < 4 || code.length > 10) {
    return false;
  }

  // Allow letters, numbers, hyphens, and underscores
  return /^[a-zA-Z0-9-_]+$/.test(code);
}

// Sanitize a custom code to ensure it's URL-safe
export function sanitizeCustomCode(code: string): string {
  return code
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "") // Remove invalid characters
    .substring(0, 10); // Limit length
}
