<!--
SYNC IMPACT REPORT
==================
Version change:    none (blank template) → 1.0.0
Bump rationale:    Initial ratification — all content is net-new.

Modified principles:  N/A (first version)
Added sections:
  - Core Principles (I–V)
  - Technology Standards
  - AI & Agent Policy
  - Governance

Templates reviewed:
  - .specify/templates/plan-template.md   ✅ Constitution Check section aligns with principles I–V
  - .specify/templates/spec-template.md   ✅ No constitution references requiring update
  - .specify/templates/tasks-template.md  ✅ Phase structure compatible with Principle II (Spec-Before-Code)

Deferred items:      None — no placeholder tokens intentionally left open.
-->

# Sonny Website Constitution

## Core Principles

### I. Human-Driven Architecture

Humans define every interface, API contract, and system boundary in this project.
Agents MUST implement what is specified; they MUST NOT invent endpoints, data shapes,
or integration contracts on their own initiative.

If an agent is deciding what an API looks like, the process is already broken.
All public-facing contracts MUST be written by the human author before implementation begins.

### II. Spec-Before-Code

No feature implementation may begin without a completed, approved spec and task list
produced through the SDD workflow (`/speckit.specify` → `/speckit.clarify` →
`/speckit.plan` → `/speckit.tasks`). Skipping any step is a constitution violation.

Agents acting as implementers MUST treat the spec and tasks as the source of truth.
Deviations require a spec amendment, not a silent code change.

### III. Quality Gates (NON-NEGOTIABLE)

Every change MUST pass all of the following before merging:

- ESLint: `bun lint` exits with zero errors.
- Markdown linting: `markdownlint-cli2 "**/*.md"` exits with zero errors.
- Conventional commits: every commit message MUST follow the `type(scope): description` format.
  Valid types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `BREAKING CHANGE`.
- Branch policy: MUST use `feat/<name>` or `fix/<name>`; direct commits to `main` are forbidden.

No merge may bypass these gates, including agent-authored changes.

### IV. Security by Design

- Secrets MUST NOT appear in source code, commits, or logs — no exceptions.
- All dependencies MUST be kept current via Dependabot pull requests; security alerts
  MUST be resolved before introducing new features.
- New features with external-facing surfaces MUST be reviewed against OWASP Top 10.
- GitHub codescan results MUST be reviewed; critical/high findings block merges.

### V. Simplicity (YAGNI)

Complexity MUST be justified by a concrete, present requirement — not a hypothetical
future one. Prefer fewer abstractions, fewer files, and fewer dependencies.

- Do not build for scale you do not have.
- Do not introduce a library when a small function suffices.
- Do not generalize until the third occurrence of a pattern.

Any constitution violation in this principle MUST be documented in the plan's
Complexity Tracking table with an explicit justification.

## Technology Standards

This project targets the following stack.

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Runtime / Toolkit | Bun |
| Linting | ESLint + markdownlint-cli2 |
| CI/CD | GitHub Actions (commit-pinned) |
| Dependency scanning | GitHub Dependabot |

Agent skill bundles active for this project: **Essentials**, **Web Wizard**,
**Full-Stack Developer**, **Security Engineer** (see `AGENTS.md`).

## AI & Agent Policy

Agents are collaborators, not decision-makers. The following rules are binding:

- Agents MUST NOT push to `main` or any protected branch.
- Agents MUST NOT create or merge pull requests without explicit human approval.
- Agents MUST NOT modify `.specify/memory/constitution.md` except when
  `/speckit.constitution` is explicitly invoked.
- Agents operating under the Antigravity skill set MUST remain within the active
  bundles declared in `AGENTS.md`. Skills outside that list require explicit session
  permission.
- Token usage SHOULD be tracked with `bunx ccusage blocks`.

## Governance

This constitution supersedes all informal conventions. When a conflict exists between
this file and any other document, this file wins.

**Amendment procedure**:

1. Open a `docs` branch (`docs/amend-constitution-vX-Y-Z`).
2. Edit `.specify/memory/constitution.md` and bump the version per semantic rules:
   - MAJOR: principle removal or redefinition that breaks existing guidance.
   - MINOR: new principle or section added.
   - PATCH: clarification, wording fix, non-semantic refinement.
3. Run `/speckit.constitution` to propagate changes and generate the Sync Impact Report.
4. Open a pull request; the human author MUST review and merge it.

**Compliance**: All pull requests MUST be checked against the five Core Principles
before merge. The plan template's *Constitution Check* gate enforces this at the
feature level.

**Versioning policy**: `CONSTITUTION_VERSION` follows semantic versioning
(`MAJOR.MINOR.PATCH`). The version line below is the authoritative record.

**Version**: 1.0.0 | **Ratified**: 2026-03-31 | **Last Amended**: 2026-03-31
