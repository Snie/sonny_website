# AGENTS.md

Top-down map of this project. Start here, then follow the pointers in
[Where to find things](#where-to-find-things) — most detail loads on demand so this file stays
small. See `docs/documentation.md` for how the documentation is organized and maintained.

## What This Repository Is

A website in Next.js about its owner, Sonny Monti.

## Tech Stack

Versions track `package.json` (maintained by the `update-techstack` skill). Run `bun outdated` to
see drift; refresh cadence is in `docs/development.md`.

- **Runtime:** Bun, Node
- **Framework:** Next.js, React, React DOM
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS, tw-animate-css, tailwind-merge, class-variance-authority, @tailwindcss/postcss
- **UI Components:** shadcn, @base-ui/react, lucide-react
- **Icons:** react-icons
- **Animation:** framer-motion
- **Charts:** apexcharts, react-apexcharts
- **Theming:** next-themes, @wrksz/themes([wrksz fixes some errors with nextjs 16](https://www.wrksz.dev/blog/wrksz-themes))
- **i18n:** next-intl
- **Analytics:** @vercel/analytics, @vercel/speed-insights
- **Utilities:** clsx
- **Testing:** vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @playwright/test
- **Linting/Formatting:** @biomejs/biome (replaces ESLint + Prettier)
- **Tooling:** GitHub Dependabot, GitHub Codescan, Context7 MCP

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
├── docs/                         # Project documentation (markdown)
│   ├── specs.md                  # Project specification (design system, i18n, testing)
│   ├── documentation.md          # Documentation architecture & maintenance guide
│   ├── development.md            # Dev commands, bundle analysis, tooling upkeep
│   ├── sdd-workflow.md           # Spec-Driven Development & subagent orchestration
│   ├── skill-bundles.md          # Active Antigravity skill bundles
│   ├── blockers.md               # Blockers log (created by agents on demand)
│   ├── security/                 # Security audit reports
│   └── resume/                   # LaTeX résumé sources
├── messages/                     # next-intl translation files (en/it/de/fr)
├── public/                       # Static assets served at /
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
├── .claude/                      # Claude Code configuration (skills, rules, settings, agents)
├── .github/                      # GitHub Actions workflows and Dependabot config
├── AGENTS.md                     # Agent and contributor map (this file)
├── README.md                     # Human-facing overview and quick start
├── CLAUDE.md                     # Claude Code project instructions (imports AGENTS.md)
├── CHANGELOG.md                  # Changelog (Keep a Changelog standard)
├── SECURITY.md                   # Security policy
├── TODO.md                       # Task tracking
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── biome.json                    # Biome linter/formatter configuration
├── package.json                  # Dependencies and scripts
└── proxy.ts                      # Next.js 16 proxy (i18n routing middleware via next-intl)
```

## Conventions

Always-true rules. Topic-specific conventions (testing, SEO, markdown) live in `.claude/rules/`
and load automatically when you touch matching files.

- **Branching**: never work on `main`. Branch from `dev` with `feat/<name>` or `fix/<name>`; PRs
  target `dev`, which is promoted to `main`. See the README CI/CD section for the full flow.
- **Commits**: use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Types:
  `feat`, `fix`, `sec` (security), `chore`, `docs`, `refactor`, `test`; breaking changes via
  `feat!:` or a `BREAKING CHANGE:` footer. Only `feat`/`fix`/`sec` trigger a release.
- **README vs AGENTS.md**: README is for humans; AGENTS.md is the agent/contributor map. Do not
  duplicate content between them. See `docs/documentation.md`.

## Workflow for new features

- Read the spec: `docs/specs.md`.
- Log blockers in `docs/blockers.md` (create it if it does not exist yet).
- Write tests for new components and utilities.

## Where to find things

| Topic | Location | Loads |
| --- | --- | --- |
| Project spec (design system, theme tokens, i18n) | `docs/specs.md` | on read |
| Documentation architecture & maintenance | `docs/documentation.md` | on read |
| Dev commands, bundle analysis, tooling upkeep | `docs/development.md` | on read |
| Spec-Driven Development & subagent orchestration | `docs/sdd-workflow.md` | on read |
| Active skill bundles | `docs/skill-bundles.md` | on read |
| Security audits | `docs/security/` | on read |
| Styling & design system (theme tokens, `ContentSection`) | `.claude/rules/styling.md` | editing `*.tsx` / `*.css` |
| Internationalization (next-intl) | `.claude/rules/i18n.md` | editing translations / locale routes |
| Testing conventions & commands | `.claude/rules/testing.md` | touching tests |
| SEO surfaces & conventions | `.claude/rules/seo.md` | touching SEO files |
| Markdown lint workflow | `.claude/rules/markdown.md` | editing markdown |
| Working on `.claude/` (skills, settings, hooks) | `claude-code` skill | on invoke |
| Keeping the tech stack list current | `update-techstack` skill | on invoke |
| Keeping skills current | `update-skills` skill | on invoke |
