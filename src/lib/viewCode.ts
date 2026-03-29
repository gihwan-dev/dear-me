import { nanoid } from 'nanoid';

/**
 * Generate a 12-char URL-safe view code.
 * Provides 62^12 ≈ 3.2×10^21 entropy — brute-force infeasible.
 */
export function generateViewCode(): string {
  return nanoid(12);
}
