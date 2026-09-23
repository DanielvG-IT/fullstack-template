# 0002. Where validation lives

- Status: accepted (template default — revisit per project)
- Date: 2026-09-23

## Context

The same business rules can end up in C# validators _and_ zod schemas. Two copies drift silently:
the failure mode is a form that accepts something the API rejects, and nobody notices until a user does.

## Decision

The **API is authoritative**. Every rule is enforced server-side. Client-side zod exists for UX
only (instant feedback, disabled submit buttons) and may be _looser_ than the server, never stricter.
The API returns RFC 9457 problem details with field errors, and the web maps them onto the form.

## Consequences

- Duplication is deliberate and one-directional: a missing client rule costs a round-trip, not
  correctness.
- Alternative for later: generate zod from `contracts/openapi.json`. Worth it once forms are
  numerous; costs a second codegen step and ties client rules to what OpenAPI can express.
