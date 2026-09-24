import "server-only";
import { z } from "zod";

const schema = z.object({
  API_URL: z.url({ protocol: /^https?$/ }),
});

let cached: z.infer<typeof schema> | undefined;

/**
 * Server-side environment, validated on first use (not at import time, so `next build` works
 * without runtime config). Fails loudly with every problem listed instead of a vague `undefined`.
 */
export function serverEnv(): z.infer<typeof schema> {
  if (!cached) {
    const result = schema.safeParse(process.env);
    if (!result.success) {
      throw new Error(`Invalid server environment:\n${z.prettifyError(result.error)}`);
    }
    cached = result.data;
  }
  return cached;
}
