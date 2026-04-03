---
name: update-techstack
description: Reads package.json and rewrites the Tech Stack section in AGENTS.md to reflect actual installed versions. Run after any dependency change.
user-invocable: true
disable-model-invocation: false
metadata:
  update-policy: never
  update-source: local
  last-updated: "2026-04-03"
---

# Update Tech Stack

## Task

Sync the `## Tech Stack` section in `AGENTS.md` with the current `package.json` and runtime versions.

## Steps

1. Run `bun --version` and capture output → Runtime Bun version
2. Run `node --version` and capture output → Runtime Node version
3. Read `package.json` — extract all `dependencies` and `devDependencies` with their version strings
4. Read `AGENTS.md` — locate the `## Tech Stack` section (between the `## Tech Stack` heading and the next `##` heading)
5. Reconstruct the Tech Stack block using the following grouping logic:

| Group | Source | Packages |
| --- | --- | --- |
| Runtime | shell | Bun (`bun --version`), Node (`node --version`) |
| Framework | package.json | next, react, react-dom |
| Language | package.json | typescript |
| Styling | package.json | tailwindcss, tw-animate-css, tailwind-merge, class-variance-authority, @tailwindcss/postcss |
| UI Components | package.json | shadcn, @base-ui/react, lucide-react |
| Icons | package.json | react-icons |
| Animation | package.json | framer-motion |
| Charts | package.json | apexcharts, react-apexcharts |
| Theming | package.json | next-themes, @wrksz/themes |
| i18n | package.json | next-intl |
| Utilities | package.json | clsx |
| Testing | package.json | vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @playwright/test |
| Linting | package.json | eslint, eslint-config-next |
| Tooling | static | GitHub Dependabot, GitHub Codescan |

1. For package.json entries strip `^` or `~` and write version as-is
1. Replace the existing `## Tech Stack` section in `AGENTS.md` with the newly generated block
1. Do not modify any other section of `AGENTS.md`
1. Report which versions changed since the previous entry

## Output format

```markdown
## Tech Stack

- **Runtime:** Bun x.y.z, Node vx.y.z
- **Framework:** Next.js 16.2.1, React 19.2.4
...
```

## Rules

- Never add packages not in package.json (except Runtime and static Tooling entries)
- Never remove static Tooling entries (Dependabot, Codescan)
- If a package moves between dependencies and devDependencies, grouping takes priority
- If `bun --version` or `node --version` fails, log a warning and omit that entry rather than erroring out
- Do not touch `metadata.last-updated` in this skill — managed manually
