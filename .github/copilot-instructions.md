# Project Overview

This is a TypeScript monorepo managed with pnpm.  
It includes multiple packages (SDKs, servers, and Next.js apps, Expo apps) that share common utilities and follow strict typing rules.

## Tech Stack

- **TypeScript** (strict mode enabled)
- **pnpm** workspaces for dependency management
- **Next.js+** for web applications
- **Expo** for mobile applications
- **Zod v4** for schema validation
- **Vitest** for unit testing
- **Biome** for linting & formatting, don't use Prettier/ESLint

## Build & Test

- Build: `pnpm build`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Dev server: `pnpm dev`

## Web & Mobile Guidelines

- **App Location:**

  - Web applications live in `apps/web`, mobile applications live in `apps/mobile`.
  - `packages/domains` contains shared business logic, hooks, ui, and types.
    - `packages/domains/XXX` can be created for domain-specific logic (e.g., `tasks`, `users`, etc.).
    - `packages/domains/ui` ccontains shared React components usable by both web and mobile.

- **Consistency:**

  - Maintain **matching folder structure** across both apps (`components/`, `layouts/`, `features/`, etc.).
  - Use the same naming conventions for files, folders, and components in both web and mobile projects.
  - Features and app flows should remain structurally aligned so that Copilot can mirror implementations across platforms.

- **Code Reuse:**

  - All **business logic, API clients (e.g., tRPC), types, and utilities** must be implemented once in shared `packages/` or `libs/` and imported by both apps.
  - Avoid duplicating logic between web and mobile—reuse is the default expectation.
  - Only create separate implementations when strictly necessary (e.g., **platform-specific UI components or native modules**).

- **Principle:**
  - **Single source of truth**: write once, consume everywhere.
  - Any divergence between web and mobile should be intentional and documented.

## Coding Guidelines

- Always prefer **async/await** over `.then()`.
- Use **arrow functions** for consistency.
- Avoid `any`; prefer `unknown` + narrowing.
- **Zod v4** schemas are mandatory for runtime validation.
- Follow **TSDoc style** for public APIs.
- Use **tree-shaking friendly exports** (no giant `index.ts` barrels, prefer per-module exports).
- Imports must be ordered: built-ins → external → internal.
- For React:
  - Use **functional components + hooks only**.
  - Type props with `interface Props {}`.
  - Use `React.FC<Props>` sparingly; prefer explicit function typing.

## Project Structure

- `apps/` → Next.js apps
- `packages/` → shared SDKs, MCP servers, and utilities
- `scripts/` → CLI tools, dev utilities

## Resources

- CI/CD: GitHub Actions → ArgoCD → K8S
- Infra notes: `infra/README.md`
- API schemas: `packages/*/schemas`
