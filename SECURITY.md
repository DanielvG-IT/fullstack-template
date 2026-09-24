# Security

## Reporting a vulnerability

Please **don't open a public issue**. Use GitHub's
[private vulnerability reporting](../../security/advisories/new) instead, or contact the maintainer
directly. You'll get a response within a week.

## What this template does by default

| Area         | Measure                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencies | Dependabot (NuGet, npm, Actions, Docker); NuGet audit of direct **and** transitive packages fails the build; lock files on both sides; pnpm only runs install scripts for allow-listed packages                                       |
| CI           | Token is read-only by default; actions pinned to commit SHAs; checkout doesn't persist credentials                                                                                                                                    |
| API          | Problem-details errors without stack traces outside Development; no `Server` header; HSTS outside Development; OpenAPI document only exposed in Development                                                                           |
| Web          | API called server-side only (`server-only`), so its URL and any future credentials stay off the client; env validated at runtime; `nosniff`, `DENY` framing, strict referrer, restrictive permissions policy, HSTS; no `X-Powered-By` |
| Repo         | Branch rulesets: PR-only `main`, required CI, no force-push, immutable `v*` tags                                                                                                                                                      |

## Per-project decisions (not in the template)

- **Content-Security-Policy** — depends on which origins the app loads from.
- **Authentication/authorization, rate limiting, CORS** — depend on the product.
- **Secrets** — use `dotnet user-secrets` / `.env.local` locally and the host's secret store in
  production. Never commit them; GitGuardian scans every push.
