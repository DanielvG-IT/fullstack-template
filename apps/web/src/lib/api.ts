import "server-only";
import { createApiClient, type ApiClient } from "@acme/api-client";
import { serverEnv } from "./env";

let client: ApiClient | undefined;

/** Server-only API client. The API URL never reaches the browser bundle. */
export function api(): ApiClient {
  client ??= createApiClient({ baseUrl: serverEnv().API_URL });
  return client;
}
