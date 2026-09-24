import createClient, { type ClientOptions } from "openapi-fetch";
import type { paths } from "./schema";

export type { components, paths } from "./schema";

export interface ApiClientOptions extends Omit<ClientOptions, "baseUrl"> {
  /** Absolute origin of the .NET API, e.g. `http://localhost:5080`. Injected, never read from env here. */
  baseUrl: string;
}

/**
 * Typed client for the .NET API. Paths, params and response bodies all come from
 * `schema.d.ts`, which is generated from `contracts/openapi.json` — run `task codegen` after
 * changing a DTO or endpoint.
 */
export function createApiClient(options: ApiClientOptions) {
  return createClient<paths>(options);
}

export type ApiClient = ReturnType<typeof createApiClient>;
