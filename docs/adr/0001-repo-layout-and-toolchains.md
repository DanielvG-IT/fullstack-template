# 0001. Repo layout and toolchains

- Status: accepted
- Date: 2026-09-23

## Context

One repo holds a .NET backend and a TypeScript frontend. No single tool spans both ecosystems:
pnpm/turbo don't understand `.csproj`, MSBuild doesn't understand workspace packages. The reason to
keep both in one repo anyway is the **contract seam**: one source of truth for the API shape, with
the TS client generated from the .NET OpenAPI document and CI failing when they drift.

## Decision

- **Folders by toolchain, not by nature.** `apps/` + `packages/` are pnpm workspaces (kebab-case);
  `services/` + `libs/` + `tests/` are .NET (PascalCase). A Next.js BFF is also a "service", but
  mixing naming conventions in one folder looks wrong to both ecosystems.
- **Two package graphs, one command layer.** MSBuild owns .NET (`Acme.slnx`, `Directory.Build.props`,
  Central Package Management). pnpm + turbo own TS (workspace + catalog). `Taskfile.yml` is the
  thin, cross-platform runner over both — `task dev` regardless of which half you touch.
- **Version pinning on both sides:** `global.json` (SDK), `Directory.Packages.props` (NuGet),
  `pnpm-workspace.yaml` catalog (npm), `.nvmrc` + `packageManager` (Node/pnpm).
- **Internal TS packages ship source, not builds.** `exports` points at `src/index.ts`; Next
  compiles them via `transpilePackages`. No per-package build step, no stale `dist/`.
- **Thin API client:** `openapi-typescript` + `openapi-fetch`, not orval. Types only, no generated
  hooks. Revisit if we hand-write the same TanStack Query wrappers three times.
- **Local infra via Docker Compose**, not Aspire. Aspire would give a dashboard and service
  discovery but couples us to its model and doesn't help Expo.
- **Minimal by default.** API + web only. Mobile (Expo) and background workers are opt-in; add
  them when a project needs them, not because the template had them. Same for `packages/ui`:
  sharing components between web and native is a large bet (Tamagui / RN Web) — share logic
  via `@acme/core` first, add `ui` after feeling the pain twice.

## Consequences

- Two dependency updaters, two formatters, two test runners. The Taskfile hides that day to day.
- The contract check in CI is what makes the monorepo pay for itself. Without it, this is just
  two repos sharing a `.git` folder.
- Toolchain pins have real coupling: typescript-eslint caps TypeScript (<6.1 today), and
  eslint-config-next caps ESLint (9). Bump them together.
