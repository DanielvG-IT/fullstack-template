# Acme

Mode: Mentor
<!-- Change to `Mode: Build` for projects where the code isn't the learning target. -->

## Architecture

.NET 10 API + Next.js web in one repo, joined by a generated contract. Read `docs/adr/` first —
decisions there are settled; propose a new ADR instead of silently diverging.

- `services/Acme.Api` → `libs/Acme.{Domain,Application,Infrastructure,Contracts}` (clean-ish layering:
  Domain has no dependencies, Application depends on Domain, Infrastructure implements Application's ports)
- `libs/Acme.Contracts` is the public API surface. Changing it changes `contracts/openapi.json` and
  `packages/api-client` — run `task codegen` and commit all three together.
- `packages/core` is framework-free TS. No React/Next/fetch imports.

## Commands

`task --list` is the index. Never hand-edit `contracts/openapi.json` or `packages/api-client/src/schema.d.ts`.
