# 0003. Contract pipeline

- Status: accepted
- Date: 2026-09-24

## Context

The web app calls the .NET API. Hand-written TS types for API responses drift from the C# DTOs
silently: it compiles, it ships, and it breaks at runtime.

## Decision

The C# code is the single source of truth, and everything downstream is generated and committed:

1. `Acme.Api` builds with `Microsoft.Extensions.ApiDescription.Server`, which boots the app in a
   special generator mode and writes `contracts/openapi.json` on **every build**.
2. `openapi-typescript` turns that spec into `packages/api-client/src/schema.d.ts` (types only, no
   runtime code). `openapi-fetch` (~6 kB) is the typed `fetch` wrapper around it.
3. `task codegen` runs both steps. CI runs the same task and fails if anything changed.
4. The web app only calls the API **server-side** (`apps/web/src/lib/api.ts`, `server-only`), so the
   API origin never ships to browsers and no CORS configuration is needed.

## Consequences

- Changing a DTO means one PR that contains the C# change, the spec diff and the TS diff — the
  spec diff doubles as an API review.
- Startup code runs during build-time generation. Anything that needs a database or secrets at
  startup must be skipped when `Assembly.GetEntryAssembly()?.GetName().Name == "GetDocument.Insider"`,
  otherwise the build breaks.
- No generated React Query hooks (orval). Revisit when client-side data fetching becomes common.
