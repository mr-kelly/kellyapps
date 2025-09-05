# kellyapps Monorepo

Monorepo managed by pnpm, containing apps and shared packages.

## Structure
```
/apps
  api - Fastify TypeScript API server
/packages
  utils - Shared utilities
```

## Getting Started
1. Install pnpm if not installed: `npm i -g pnpm`
2. Install dependencies:
```bash
pnpm install
```
3. Build all:
```bash
pnpm build
```
4. Start API (dev):
```bash
pnpm --filter @kellyapps/api dev
```

## Add New Package
```bash
pnpm create package packages/newpkg
```
(or manually copy existing package template)

## Notes
- Shared base tsconfig: `tsconfig.base.json` (module set to NodeNext for ESM)
- Dev uses `tsx` for fast TypeScript execution.
- Workspace version resolution via `workspace:*`
