# Implementation Plan: Unit Test Suite for Dependabot Safety

**Branch**: `002-unit-test-suite` | **Date**: 2026-04-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-unit-test-suite/spec.md`

## Summary

Add a comprehensive test suite (Vitest + React Testing Library for unit/component tests, Playwright for E2E smoke tests) with CI pipeline and Dependabot auto-merge for patch/minor updates. Every section component gets render + full content verification tests using real translation files. Utility functions get unit tests with multiple input scenarios. A GitHub Actions workflow gates all PRs, and a dedicated auto-merge workflow handles Dependabot PRs for patch/minor version bumps.

## Technical Context

**Language/Version**: TypeScript 6 (strict mode)
**Primary Dependencies**: Next.js 16.2.1, React 19.2.4, Vitest, @testing-library/react, Playwright
**Storage**: N/A (static site)
**Testing**: Vitest (unit/component), Playwright (E2E), @testing-library/react (component rendering)
**Target Platform**: Web (static portfolio), CI on ubuntu-latest
**Project Type**: Web application (Next.js App Router, static portfolio)
**Performance Goals**: Full test suite under 60 seconds on CI
**Constraints**: All GitHub Actions pinned to commit hashes; Bun as package manager
**Scale/Scope**: 9 section components, 3 UI primitives, 2 controls, 2 utilities, 1 i18n config, 2 app pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Human-Driven Architecture | PASS | No new APIs or contracts invented; test infrastructure follows spec |
| II. Spec-Before-Code | PASS | Spec created via /speckit.specify, clarified via /speckit.clarify |
| III. Quality Gates | PASS | CI workflow enforces ESLint + tests; GitHub Actions pinned to hashes; conventional commits |
| IV. Security by Design | PASS | No secrets in code; Dependabot auto-merge gated by CI checks; only patch/minor auto-merged |
| V. Simplicity (YAGNI) | PASS | No snapshot testing, no visual regression, no multi-browser E2E; minimal mocking strategy |

## Project Structure

### Documentation (this feature)

```text
specs/002-unit-test-suite/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — no data model)
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
sonny_website/
├── vitest.config.ts                    # Vitest configuration
├── playwright.config.ts                # Playwright configuration
├── test/
│   ├── setup.ts                        # Global test setup (browser API mocks)
│   ├── utils.tsx                       # Shared render wrapper with i18n provider
│   ├── mocks/
│   │   ├── next-image.tsx              # next/image → plain <img>
│   │   ├── next-link.tsx               # next/link → plain <a>
│   │   ├── framer-motion.tsx           # motion.* → plain HTML elements
│   │   ├── wrksz-themes.ts            # @wrksz/themes/client mock
│   │   └── react-apexcharts.tsx        # react-apexcharts → <div>
│   └── e2e/
│       └── smoke.spec.ts              # Playwright E2E smoke test
├── lib/__tests__/
│   ├── utils.test.ts                   # cn() unit tests
│   ├── text-utils.test.tsx             # jsonTextToHtml() unit tests
│   └── i18n.test.ts                    # Locale loading verification
├── components/__tests__/
│   ├── hero-section.test.tsx
│   ├── author-note.test.tsx
│   ├── about-section.test.tsx
│   ├── skills-section.test.tsx
│   ├── timeline.test.tsx
│   ├── education-section.test.tsx
│   ├── academic-section.test.tsx
│   ├── languages-section.test.tsx
│   ├── elsewhere-section.test.tsx
│   ├── theme-toggle.test.tsx
│   └── language-switcher.test.tsx
├── components/ui/__tests__/
│   ├── content-section.test.tsx
│   ├── card.test.tsx
│   └── button.test.tsx
├── app/[locale]/__tests__/
│   ├── error.test.tsx
│   └── loading.test.tsx
└── .github/workflows/
    ├── test.yml                        # CI test workflow (unit + E2E)
    └── dependabot-auto-merge.yml       # Auto-merge for patch/minor
```

**Structure Decision**: Co-located `__tests__/` directories next to source code for unit/component tests. Separate `test/` directory at root for shared infrastructure (setup, mocks, utils) and E2E tests. This keeps test files discoverable next to the code they test while centralizing shared test utilities.
