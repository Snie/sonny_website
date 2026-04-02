# AGENTS.md

## What This Repository Is

A website in nextjs about the owner of it Sonny Monti.

## Tech Stack

- Frontend: Next.js, Tailwind, shadcn/ui
- Tooling: Bun, GitHub Dependabot, GitHub Codescan

## Workflow for new features

- IMPORTANT! Read the specifications Spec: @docs/spec.md
- Write Blockers in: @docs/blockers.md

## Repository Structure

```text
.
├── app/                  # Next.js app router (pages, layouts, global styles)
├── docs/                 # Developer documentation (markdown)
│   └── dev/              # Development notes and references
├── public/               # Static assets served at /
├── types/                # Shared TypeScript type declarations
├── .claude/              # Claude Code configuration (skills, settings, hooks)
├── .github/              # GitHub Actions workflows and Dependabot config
├── AGENTS.md             # Agent and contributor conventions (this file)
├── README.md             # Human-facing overview and quick start
├── CLAUDE.md             # Claude Code project instructions
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.mjs     # ESLint configuration
└── package.json          # Dependencies and scripts
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
bun lint      # Run ESLint
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
