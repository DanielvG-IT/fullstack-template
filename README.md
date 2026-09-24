# Acme — .NET + Next.js monorepo template

.NET 10 API and a Next.js web app in one repo, joined by a **generated, CI-enforced API contract**.

```
Acme.Contracts (C# DTOs) ──build──▶ contracts/openapi.json ──codegen──▶ @acme/api-client ──▶ apps/web
```

## Start a new project

1. On GitHub: **Use this template → Create a new repository**, then clone it.
2. Install prerequisites: .NET SDK (see `global.json`), Node (see `.nvmrc`), pnpm (`corepack enable`),
   Docker, and [Task](https://taskfile.dev) (`brew install go-task` / `winget install Task.Task`).
3. Rename the placeholder, then commit:

   ```bash
   task init -- MyProduct
   ```

   `Acme` → `MyProduct` (namespaces, files, solution), `acme` → `my-product` (npm scope, compose).

4. `task setup && task up && task dev` → API on http://localhost:5080, web on http://localhost:3000.
5. Set up branch protection — rulesets aren't copied with a template. Import the JSON files from
   your rulesets collection (Settings → Rules → Rulesets → Import), or run its `apply.sh`.

## Daily commands

| Command                      | What                                                                        |
| ---------------------------- | --------------------------------------------------------------------------- |
| `task dev`                   | API + web with hot reload                                                   |
| `task codegen`               | After changing a DTO or endpoint: regenerate `openapi.json` + the TS client |
| `task check`                 | Everything CI checks — run before opening a PR                              |
| `task format`                | Auto-fix formatting in both halves                                          |
| `task up` / `down` / `reset` | Local infra: start / stop / wipe data                                       |
| `task`                       | List every task                                                             |

## Changing the API

1. Change or add a DTO in `libs/Acme.Contracts` and the endpoint in `services/Acme.Api`.
2. `task codegen` — `contracts/openapi.json` and `packages/api-client/src/schema.d.ts` update.
3. Use it from the web: `await api().GET("/api/your-route")` is fully typed (see `apps/web/src/app/page.tsx`).
4. Commit all three together. CI's `contract` job fails if you forget step 2.

## Layout

| Path            | Toolchain | What                                                 |
| --------------- | --------- | ---------------------------------------------------- |
| `services/`     | .NET      | Deployables (`Acme.Api`)                             |
| `libs/`         | .NET      | Domain, Application, Infrastructure, Contracts       |
| `tests/`        | .NET      | xUnit; `Acme.Api.Tests` uses `WebApplicationFactory` |
| `apps/`         | pnpm      | Deployables (`web` — Next.js)                        |
| `packages/`     | pnpm      | `core`, `api-client`, `tsconfig`, `eslint-config`    |
| `contracts/`    | —         | Generated `openapi.json`, committed                  |
| `infra/docker/` | —         | Local Postgres, Seq (logs), Mailpit (mail)           |
| `docs/adr/`     | —         | Why things are the way they are                      |

Versions are pinned centrally: `Directory.Packages.props` (NuGet) and the `catalog:` in
`pnpm-workspace.yaml` (npm). Never put a version number in a `.csproj` or a workspace `package.json`.

## Opt-in add-ons

Not included by default — add when a project needs them, and write an ADR when you do.

- **Mobile (Expo):** `apps/mobile`. Try pnpm's default isolated linker first; recent Expo SDKs
  auto-configure Metro for monorepos. Fall back to `nodeLinker: hoisted` only if resolution fails.
- **Background worker:** `dotnet new worker -o services/Acme.Workers.<Name>`, add to `Acme.slnx`.
- **EF Core:** add to `Acme.Infrastructure`, `dotnet tool install dotnet-ef` (local manifest),
  add `db:migrate` / `db:add` tasks.
- **Shared UI (`packages/ui`):** only once web _and_ mobile exist and you've duplicated a component twice.

## Security

See [SECURITY.md](SECURITY.md) for what's hardened by default and what each project must decide.
