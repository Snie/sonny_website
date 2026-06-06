# Development

Local development commands, bundle analysis, and external tooling upkeep. Test commands and
conventions live in `.claude/rules/testing.md` (auto-loaded when working with test files).

## Bun all-in-one toolkit for developing js/ts apps

To upgrade Bun: `bun upgrade`.

### Run the server

```bash
bun dev       # Start the development server
bun build     # Build for production
bun lint      # Run Biome (lint + format check)
```

### Dependency management

```bash
# Install deps
bun install
# Add (use -d for dev deps)
bun add zod@3.0.0
# Update a single dependency
bun update @types/bun
# Update all dependencies
bun update
# Ignore semver, update to the latest version
bun update @types/bun --latest
# View outdated deps
bun outdated
```

## Bundle Analysis

`@next/bundle-analyzer` is wired into `next.config.ts` behind the `ANALYZE` env flag. Use it when
changing dependencies, adding heavy components, or investigating a regression in initial JS payload.

```bash
ANALYZE=true bun run build
```

The build emits three HTML reports under `.next/analyze/`:

- `client.html` — what ships to the browser (the one you usually want)
- `nodejs.html` — server-side bundle
- `edge.html` — edge runtime bundle (empty for this project)

What to look for:

- framer-motion should sit in a lazy chunk (loaded via `LazyMotion`), not in the main route bundle.
- Below-fold sections wrapped in `next/dynamic` should each have their own chunk.
- Any single chunk above ~150 kB gzipped is worth investigating.

The reports are git-ignored; do not commit them.

> Note: under Next 16 Turbopack, `@next/bundle-analyzer` may emit nothing — measure chunks directly
> via the build manifest + gzip instead.

## Tooling Maintenance

External tooling must be kept up to date. Run these commands periodically.

| Tool | Update command | Cadence |
| --- | --- | --- |
| Context7 MCP | `npx ctx7 setup` | monthly or after issues |
| Antigravity skills | `bunx antigravity-awesome-skills --claude` | monthly |
| GitHub Spec Kit | `uv tool upgrade spec-kit` | monthly |
| Bun | `bun upgrade` | monthly |
| Dependencies | `bun update` / `bun outdated` | weekly |
