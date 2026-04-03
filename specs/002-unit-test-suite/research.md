# Research: Unit Test Suite for Dependabot Safety

## Decision 1: Test Runner

**Decision**: Vitest + React Testing Library
**Rationale**: User specified this combination. Vitest is the standard for Vite-based and modern React projects, runs natively with Bun, supports jsdom environment, and has first-class TypeScript support. React Testing Library encourages testing components as users interact with them.
**Alternatives considered**: Jest (heavier, worse ESM support with Next.js 16), Bun's built-in test runner (lacks React component testing ecosystem)

## Decision 2: E2E Framework

**Decision**: Playwright (chromium only)
**Rationale**: User specified Playwright. Chromium-only keeps CI fast (under 60 seconds). For a static portfolio site, multi-browser testing adds cost without proportional value.
**Alternatives considered**: Cypress (heavier, slower CI), multi-browser Playwright (unnecessary for static site)

## Decision 3: Mocking Strategy for next-intl

**Decision**: Use real `NextIntlClientProvider` with real `messages/en.json` translation files
**Rationale**: Per spec clarification, tests must verify complete expected text content from translations. Using real messages catches both rendering failures AND missing/changed translation keys.
**Alternatives considered**: Mocking `useTranslations` hook (faster but loses content verification, which was explicitly rejected in clarification)

## Decision 4: Test File Location

**Decision**: Co-located `__tests__/` directories adjacent to source files
**Rationale**: Keeps tests discoverable next to the code they test. Shared infrastructure (setup, mocks, utils) lives in a root-level `test/` directory.
**Alternatives considered**: Separate top-level `tests/` mirroring `components/` (harder to maintain 1:1 mapping)

## Decision 5: Auto-merge Implementation

**Decision**: GitHub Actions workflow using `dependabot/fetch-metadata` + `gh pr merge --auto --squash`
**Rationale**: No third-party dependencies beyond GitHub's own tooling. `fetch-metadata` provides semver update type for filtering. `--auto` flag means GitHub merges only after all required status checks pass (branch protection enforcement).
**Alternatives considered**: Third-party auto-merge actions (unnecessary dependency), manual approval scripts (defeats purpose)

## Decision 6: Framer Motion Handling

**Decision**: Mock `motion.*` components to render plain HTML equivalents
**Rationale**: Animation timing makes tests flaky. Components function identically without animation wrappers. Mocking keeps tests fast and deterministic.
**Alternatives considered**: Running animations in tests (slow, flaky), using `prefers-reduced-motion` mock (still requires animation timing)

## Decision 7: Canvas/Browser API Handling

**Decision**: Global mocks in `test/setup.ts` for Canvas 2D context, matchMedia, IntersectionObserver, ResizeObserver
**Rationale**: `hex-grid-background.tsx` uses Canvas extensively. jsdom doesn't implement Canvas. Mock provides enough for mount/unmount lifecycle testing without visual verification.
**Alternatives considered**: Skipping hex-grid tests entirely (misses mount failures), using canvas-jest mock package (unnecessary dependency per YAGNI)
