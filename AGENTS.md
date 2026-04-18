# AGENTS.md

## What This Repository Is

A website in nextjs about the owner of it Sonny Monti.

## Tech Stack

Versions track `package.json`. Run `bun outdated` to see drift; the cadence
table below covers refresh frequency.

- **Runtime:** Bun (latest, see Tooling Maintenance), Node 25
- **Framework:** Next.js 16.2.3, React 19.2.5, React DOM 19.2.5
- **Language:** TypeScript ^6.0.2 (strict mode)
- **Styling:** Tailwind CSS ^4.2.2, tw-animate-css ^1.4.0, tailwind-merge ^3.5.0, class-variance-authority ^0.7.1, @tailwindcss/postcss ^4.2.2
- **UI Components:** shadcn ^4.3.0, @base-ui/react ^1.4.0, lucide-react ^1.8.0
- **Icons:** react-icons ^5.6.0
- **Animation:** framer-motion ^12.38.0
- **Charts:** apexcharts ^5.10.6, react-apexcharts ^2.1.0
- **Theming:** next-themes ^0.4.6, @wrksz/themes ^0.8.3 ([wrksz fixes some errors with nextjs 16](https://www.wrksz.dev/blog/wrksz-themes))
- **i18n:** next-intl ^4.9.1
- **Analytics:** @vercel/analytics ^2.0.1, @vercel/speed-insights ^2.0.0
- **Utilities:** clsx ^2.1.1
- **Testing:** vitest ^4.1.4, @testing-library/react ^16.3.2, @testing-library/jest-dom ^6.9.1, @testing-library/user-event ^14.6.1, @playwright/test ^1.59.1
- **Linting/Formatting:** @biomejs/biome ^2.4.11 (replaces ESLint + Prettier)
- **Tooling:** GitHub Dependabot, GitHub Codescan, Context7 MCP
- **MCP Servers:** [Context7](https://context7.com/docs/overview) (`.claude/.mcp.json`)

## MCP Servers

### Context7

Context7 provides up-to-date documentation for libraries directly in context.
Configured in `.claude/.mcp.json` as a stdio server via `npx @upstash/context7-mcp@latest`.

**When to use:** Consult Context7 when encountering errors related to the tech stack,
when tests fail due to API misuse, or when debugging stack traces that suggest incorrect
usage of a dependency. It provides accurate, version-aware documentation that avoids
hallucinated or outdated API references.

## Tooling Maintenance

External tooling must be kept up to date. Run these commands periodically
to ensure the latest versions are in use.

| Tool | Update command | Cadence |
| --- | --- | --- |
| Context7 MCP | `npx ctx7 setup` | monthly or after issues |
| Antigravity skills | `bunx antigravity-awesome-skills --claude` | monthly |
| GitHub Spec Kit | `uv tool upgrade spec-kit` | monthly |
| Bun | `bun upgrade` | monthly |
| Dependencies | `bun update` / `bun outdated` | weekly |

## Workflow for new features

- IMPORTANT! Read the specifications Spec: @docs/spec.md
- Write Blockers in: @docs/blockers.md
- Write tests for new components and utilities

## Repository Structure

```text
.
├── app/                          # Next.js app router
│   ├── [locale]/                 # Localized routes (en/it/de/fr)
│   │   ├── layout.tsx            # Root layout, metadata, JSON-LD, header/footer
│   │   ├── page.tsx              # Home page (ProfilePage JSON-LD)
│   │   ├── opengraph-image.tsx   # Per-locale OG image (SSG via generateStaticParams)
│   │   └── twitter-image.tsx     # Twitter card image (re-exports OG)
│   ├── sitemap.ts                # Locale-aware sitemap (/sitemap.xml)
│   ├── robots.ts                 # robots directives (/robots.txt)
│   ├── manifest.ts               # PWA manifest (/manifest.webmanifest)
│   ├── icon.tsx                  # 32×32 favicon (green SM monogram)
│   └── apple-icon.tsx            # 180×180 Apple touch icon
├── components/                   # React UI components (sections, controls, ui primitives)
├── docs/                         # Developer documentation (markdown)
│   └── dev/                      # Development notes and references
├── messages/                     # next-intl translation files (en/it/de/fr)
├── public/                       # Static assets served at /
├── types/                        # Shared TypeScript type declarations
├── lib/                          # Utility functions
│   ├── i18n.ts                   # Locale list + next-intl request config
│   ├── site-config.ts            # SITE constants (URL, name, social, accent)
│   └── seo/jsonld.ts             # Person, WebSite, ProfilePage schema builders
├── test/                         # Shared test infrastructure (setup, mocks, utils)
│   ├── e2e/                      # Playwright E2E specs
│   └── mocks/                    # Module mocks for Vitest
├── specs/                        # Spec-Driven Development artifacts
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
├── .claude/                      # Claude Code configuration (skills, settings, hooks)
├── .github/                      # GitHub Actions workflows and Dependabot config
├── AGENTS.md                     # Agent and contributor conventions (this file)
├── README.md                     # Human-facing overview and quick start
├── CLAUDE.md                     # Claude Code project instructions
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── biome.json                    # Biome linter/formatter configuration
├── package.json                  # Dependencies and scripts
└── proxy.ts                      # Next.js 16 proxy (i18n routing middleware via next-intl)
```

## How Personal Claude Skills Are Structured

The project uses antigravity-awsome-skills, user self defined skills are present in this project and follows the following rules:

`.claude/skills` are created with the best practices obtained from the
[official documentation](https://code.claude.com/docs/en/skills#create-your-first-skill).

Every `SKILL.md` must open with YAML frontmatter between `---` markers. Required fields:

```yaml
---
name: example-best-practices   # Slug for the /slash-command. Lowercase, hyphens, max 64.
description: One-line plain string. What it does and when to use it. Front-load the key case.
metadata:
  update-policy: monthly        # monthly | quarterly | manual | never
  update-source: https://example.org  # URL to fetch directly, or "web-search"
  last-updated: "2026-03-29"    # Date content was last refreshed: YYYY-MM-DD
---
```

The `metadata` key is used for project-specific fields. Do not place `update-policy`,
`update-source`, or `last-updated` at the top level — they are not part of the Claude Code
standard and will trigger validation warnings if placed outside `metadata`.

## Rules

### Documentation and markdown rules

- README.md is for humans: quick start, project description, contribution guidelines. AGENTS.md
 complements it with detailed context for coding agents and humans who want depth: conventions,
 rules, and instructions that would clutter a README or are irrelevant to casual contributors.
 Do not duplicate content between the two. If something belongs in README.md, it stays there.
 If it belongs in AGENTS.md, it stays there.
- After writing a markdown file, run the linter and fix all violations before moving on with `markdownlint-cli2`, this rule doesn't apply to the folder specs
- Keep a changelog standard

### github & git rules

- Whenever creating GitHub Actions, pin to a commit hash instead of a version tag.
- Use conventional commits

## Commands

### Bun all-in-one toolkit for developing js/ts apps

to upgrade bun use `bun upgrade`

#### Run the server

```bash
bun dev       # Start the development server
bun build     # Build for production
bun lint      # Run Biome (lint + format check)
```

#### Bun dependency management

```bash
# Install deps
bun install
# Add
bun add zod@3.0.0 # for dev deps use -d
# Update a single dependency
bun update @types/bun
# Update all dependencies
bun update
# Ignore semver, update to the latest version
bun update @types/bun --latest
# view outdated deps
bun outdated
```

### Testing

```bash
bun run test        # Unit and component tests (Vitest)
bun run test:watch  # Watch mode during development
bun run test:e2e    # E2E smoke test (Playwright, builds the app)
bun run test:all    # Run unit + E2E tests
```

### Bundle Analysis

`@next/bundle-analyzer` is wired into `next.config.ts` behind the
`ANALYZE` env flag. Use it when changing dependencies, adding heavy
components, or investigating a regression in initial JS payload.

```bash
ANALYZE=true bun run build
```

The build emits three HTML reports under `.next/analyze/`:

- `client.html` — what ships to the browser (the one you usually want)
- `nodejs.html` — server-side bundle
- `edge.html` — edge runtime bundle (empty for this project)

What to look for:

- framer-motion should sit in a lazy chunk (loaded via `LazyMotion`),
  not in the main route bundle.
- Below-fold sections wrapped in `next/dynamic` should each have their
  own chunk.
- Any single chunk above ~150 kB gzipped is worth investigating.

The reports are git-ignored; do not commit them.

## SEO

The site URL, social handles, and brand accent live in `lib/site-config.ts`
(`SITE`). Every SEO surface imports from there — never hardcode `https://sonnymonti.com`
or social URLs in components or pages.

| Concern | File |
| --- | --- |
| Site config (URL, name, social, accent) | `lib/site-config.ts` |
| JSON-LD builders (Person, WebSite, ProfilePage) | `lib/seo/jsonld.ts` |
| Per-locale metadata (title, description, OG, hreflang, canonical, robots) | `app/[locale]/layout.tsx` (`generateMetadata` + `viewport`) |
| Translated title/description/og-tagline | `messages/<locale>.json` → `seo.*` namespace |
| Sitemap (`/sitemap.xml`) | `app/sitemap.ts` |
| Robots (`/robots.txt`) | `app/robots.ts` |
| PWA manifest (`/manifest.webmanifest`) | `app/manifest.ts` |
| Favicons (`/icon`, `/apple-icon`) | `app/icon.tsx`, `app/apple-icon.tsx` |
| Open Graph / Twitter images | `app/[locale]/opengraph-image.tsx`, `app/[locale]/twitter-image.tsx` |

Conventions:

- All metadata flows through `next-intl` translations — no hardcoded copy in
  `generateMetadata`.
- JSON-LD uses `@id` references inside `@graph` to dedupe shared nodes
  (e.g. `ProfilePage.mainEntity` references `Person` by `@id` instead of
  duplicating the object).
- Production URL override at build time: `NEXT_PUBLIC_SITE_URL`.
- Google Search Console verification: `GOOGLE_SITE_VERIFICATION` (no-op when unset).
- Favicons are code-generated via `ImageResponse` — do not commit binary
  `favicon.ico` / PNG icon files unless overriding the route on purpose.
- When adding a new public route, add it to `app/sitemap.ts` and ensure the
  layout's `alternates.languages` covers all locales.
- Use the `seo-audit` skill against the deployed preview before merging
  SEO-relevant changes; target Health Index ≥ 80 (Good).

## Testing Rules

- Co-locate test files in `__tests__/` directories next to source files
- Use real translations (`messages/en.json`) via the custom render wrapper in `test/utils.tsx`
- Mock external dependencies (framer-motion, react-icons, next/image, next/link) using mocks in `test/mocks/`
- No snapshot testing or visual regression testing
- Tests must be deterministic and fast (full suite under 60 seconds)

## Git Conventions

### Branching strategy

Never work on `main` directly. Create branches with these prefixes:

- `feat/<name>` — new features
- `fix/<name>` — bug fixes

### Commit messages

Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Valid types: `feat`, `fix`, `BREAKING CHANGE`, `chore`, `docs`, `refactor`, `test`.

## Active Skill Bundles

This project uses the following [Antigravity](https://github.com/sickn33/antigravity-awesome-skills) bundles.
Invoke skills with `/skill-name` or `@skill-name`. Do not use skills outside this list unless explicitly requested.

### Essentials

- `@concise-planning` — always plan before coding
- `@lint-and-validate` — keep code clean automatically
- `@git-pushing` — save work safely
- `@kaizen` — continuous improvement mindset
- `@systematic-debugging` — debug methodically, not randomly

### Web Wizard

- `@frontend-design` — UI guidelines and aesthetics
- `@react-best-practices` — React & Next.js performance
- `@react-patterns` — modern React patterns
- `@nextjs-best-practices` — App Router patterns
- `@tailwind-patterns` — Tailwind CSS v4
- `@form-cro` — form conversion optimization
- `@seo-audit` — SEO fundamentals

### Full-Stack Developer

- `@senior-fullstack` — complete fullstack guide
- `@frontend-developer` — React 19+ / Next.js 15+
- `@backend-dev-guidelines` — Node.js / TypeScript patterns
- `@api-patterns` — REST vs GraphQL vs tRPC
- `@database-design` — schema design and ORM selection
- `@stripe-integration` — payments and subscriptions

### Security Engineer

- `@ethical-hacking-methodology` — ethical hacking bible
- `@top-web-vulnerabilities` — OWASP-aligned taxonomy
- `@security-auditor` — comprehensive security audits
- `@vulnerability-scanner` — advanced vulnerability analysis

## Spec-Driven Development (SDD) Workflow

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for SDD.
The workflow for implementing a new feature with AI agents:

1. `/speckit.constitution` — establish project principles
2. `/speckit.specify` — create baseline specification
3. `/speckit.clarify` — resolve underspecified areas
4. `/speckit.plan` — create implementation plan
5. `/speckit.tasks` — generate actionable tasks
6. `/speckit.implement` — execute implementation

**Role split:**

- Human = spec owner + evaluator (defines WHAT and WHY, never HOW)
- Powerful and expensive LLM = lead orchestrator (architecture decisions, spec review)
- Less powerful and cheaper LLM = subagent worker

### Subagent Orchestration

When the user asks to "work with subagents" or "use agents", the orchestrator (Opus)
delegates tasks from the active spec's `tasks.md` to specialized subagents defined
in `.claude/agents/`. The orchestrator reads the tasks, decides which agent handles
each task, and parallelizes independent work.

#### Available subagents

| Agent | Model | Scope | Color | Memory |
| --- | --- | --- | --- | --- |
| `frontend` | claude-sonnet-4-6 | Next.js, React, Tailwind — UI components, pages, styling | cyan | project |
| `tester` | claude-sonnet-4-6 | Vitest, RTL, Playwright — tests, test infra, test fixing | green | project |
| `reviewer` | claude-sonnet-4-6 | Code review — bugs, security, performance, conventions | purple | project |

All subagents have access to Context7 MCP, with respect to the rules in this file, and all agents have project-scoped persistent memory.

#### Delegation rules

1. **Orchestrator reads** `specs/<feature>/tasks.md` to understand the full task list
2. **Orchestrator prompts each subagent** with enough context from the spec, plan,
   and task description so the subagent can execute without additional discovery
3. **Parallelism**: tasks marked `[P]` in the same phase are dispatched in parallel
4. **Sequential**: tasks without `[P]` or cross-phase dependencies run sequentially
5. **Review gate**: after each phase, the orchestrator may dispatch the `reviewer`
   agent to check the work before proceeding
6. **Test fixing**: when tests fail, the orchestrator dispatches the `tester` agent
   with the `@test-fixing` skill to diagnose and fix failures

#### Task-to-agent mapping

| Task type | Agent |
| --- | --- |
| Component creation, styling, layouts | `frontend` |
| Test files, test infrastructure, mocks | `tester` |
| E2E tests (Playwright) | `tester` |
| CI workflows, GitHub Actions | orchestrator (Opus) |
| Documentation updates (AGENTS.md, specs) | orchestrator (Opus) |
| Code review after implementation | `reviewer` |

#### How to invoke

Tell the orchestrator:

```text
work with subagents
```

**And using spec kit:**

```text
/speckit.implement work with subagents
```

The orchestrator will load the tasks, delegate to the appropriate agents,
and coordinate the work.
