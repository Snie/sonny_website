# Tasks: Unit Test Suite for Dependabot Safety

**Input**: Design documents from `/specs/002-unit-test-suite/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Tests ARE the primary deliverable of this feature. All test tasks are implementation tasks.

**Organization**: Tasks grouped by user story. US2 and US3 provide the test files; US4 provides the CI pipeline; US1 ties it together with auto-merge.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create configuration files

- [ ] T001 Install test dependencies: `bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react vite-tsconfig-paths jsdom @playwright/test`
- [ ] T002 Install Playwright chromium browser: `bunx playwright install --with-deps chromium`
- [ ] T003 Create Vitest configuration in vitest.config.ts (jsdom env, react plugin, tsconfig-paths, setup file ./test/setup.ts, include pattern `**/__tests__/**/*.test.{ts,tsx}`, globals enabled)
- [ ] T004 Create Playwright configuration in playwright.config.ts (testDir ./test/e2e, chromium only, webServer bun run build && bun run start on port 3000)
- [ ] T005 Add test scripts to package.json: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`, `"test:all": "vitest run && playwright test"`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Test infrastructure that ALL test files depend on — mocks, setup, and shared utilities

**CRITICAL**: No test file can be written until this phase is complete

- [ ] T006 Create global test setup in test/setup.ts — import @testing-library/jest-dom, mock window.matchMedia, IntersectionObserver, ResizeObserver, HTMLCanvasElement.prototype.getContext (stub 2D context with no-op drawing methods)
- [ ] T007 Create shared render wrapper in test/utils.tsx — wrap components in NextIntlClientProvider with real messages/en.json, re-export everything from @testing-library/react
- [ ] T008 [P] Create next/image mock in test/mocks/next-image.tsx — render plain `<img>` with src, alt, width, height props
- [ ] T009 [P] Create next/link mock in test/mocks/next-link.tsx — render plain `<a>` with href and children
- [ ] T010 [P] Create framer-motion mock in test/mocks/framer-motion.tsx — mock motion namespace so motion.div renders as div, motion.span as span, etc. Export AnimatePresence as passthrough
- [ ] T011 [P] Create @wrksz/themes/client mock in test/mocks/wrksz-themes.ts — export useTheme returning controllable resolvedTheme, setTheme, and theme values
- [ ] T012 [P] Create react-apexcharts mock in test/mocks/react-apexcharts.tsx — default export renders `<div data-testid="apex-chart" />`
- [ ] T013 Verify test infrastructure works: run `bun test` with an empty placeholder test to confirm vitest.config.ts, setup.ts, and utils.tsx load correctly, then delete the placeholder

**Checkpoint**: Test infrastructure ready — all test files can now be written

---

## Phase 3: User Story 2 — Components Render Without Errors (Priority: P1) MVP

**Goal**: Every section component has a render test that verifies mount + full content from translations

**Independent Test**: Run `bun test` — all component tests pass, confirming every section renders expected content from en.json

### UI Primitive Tests (FR-003)

- [ ] T014 [P] [US2] Create render tests for ContentSection in components/ui/__tests__/content-section.test.tsx — renders children, renders heading when provided, omits heading when not provided, applies custom className
- [ ] T015 [P] [US2] Create render tests for Card components in components/ui/__tests__/card.test.tsx — Card renders children, CardHeader/CardTitle/CardDescription/CardContent/CardFooter/CardAction render with correct data-slot attributes
- [ ] T016 [P] [US2] Create render tests for Button in components/ui/__tests__/button.test.tsx — renders with default variant, renders each variant (outline, secondary, ghost, destructive, link), renders sizes, handles onClick, renders as disabled

### Section Component Tests (FR-002)

- [ ] T017 [P] [US2] Create render + content test for AuthorNote in components/__tests__/author-note.test.tsx — renders without error, contains authorNote.text paragraphs from en.json (vi.mock framer-motion)
- [ ] T018 [P] [US2] Create render + content test for AboutSection in components/__tests__/about-section.test.tsx — renders heading "About", contains about.text paragraphs from en.json
- [ ] T019 [P] [US2] Create render + content test for SkillsSection in components/__tests__/skills-section.test.tsx — renders heading "Stack", renders all 8 category titles (Languages, Code Quality & Build, etc.), spot-checks tool names (Python, Docker, React) (vi.mock framer-motion, react-icons)
- [ ] T020 [P] [US2] Create render + content test for Timeline in components/__tests__/timeline.test.tsx — renders heading "Work Experience", renders all 5 entry roles/companies/periods from en.json (vi.mock framer-motion)
- [ ] T021 [P] [US2] Create render + content test for EducationSection in components/__tests__/education-section.test.tsx — renders heading "Education", renders degree titles and institution names from en.json
- [ ] T022 [P] [US2] Create render + content test for AcademicSection in components/__tests__/academic-section.test.tsx — renders heading "Academic Work", renders entry titles and institutions from en.json
- [ ] T023 [P] [US2] Create render + content test for LanguagesSection in components/__tests__/languages-section.test.tsx — renders heading "Languages", mocked chart present via data-testid="apex-chart" (vi.mock react-apexcharts, @wrksz/themes/client, next/dynamic)
- [ ] T024 [P] [US2] Create render + content test for ElsewhereSection in components/__tests__/elsewhere-section.test.tsx — renders heading "Elsewhere", renders card titles (ACM, Swiss Army, Cantina Monti, Music & Gaming, Tennis & Snowboard) from en.json (vi.mock next/image, framer-motion)
- [ ] T025 [P] [US2] Create render + content test for HeroSection in components/__tests__/hero-section.test.tsx — renders intro text from en.json (vi.mock next/image, @wrksz/themes/client, HexGridBackground → div, VideoText → plain children, framer-motion)

### Control Component Tests (FR-004)

- [ ] T026 [P] [US2] Create render test for ThemeToggle in components/__tests__/theme-toggle.test.tsx — renders a button, displays correct icon per theme state (vi.mock @wrksz/themes/client)
- [ ] T027 [P] [US2] Create render test for LanguageSwitcher in components/__tests__/language-switcher.test.tsx — renders 4 locale buttons (EN, IT, DE, FR), current locale highlighted (vi.mock next/link, next-intl/navigation)

### App Page Tests (FR-010)

- [ ] T028 [P] [US2] Create render test for error boundary in app/[locale]/__tests__/error.test.tsx — renders error message text, renders "Try again" button, clicking calls the reset function
- [ ] T029 [P] [US2] Create render test for loading state in app/[locale]/__tests__/loading.test.tsx — renders spinner element (div with animate-spin)

### Validation

- [ ] T030 [US2] Run `bun test` and verify all component tests pass. Use @test-fixing skill if any fail.

**Checkpoint**: All 16 component/UI/control/page test files pass. User Story 2 is independently verified.

---

## Phase 4: User Story 3 — Utility Functions Produce Correct Output (Priority: P2)

**Goal**: All utility functions and i18n config have unit tests with multiple input scenarios

**Independent Test**: Run `bun test lib/__tests__/` — all utility tests pass

### Implementation

- [ ] T031 [P] [US3] Create unit tests for cn() in lib/__tests__/utils.test.ts — normal merge ("px-2", "py-1"), conflict resolution ("px-2", "px-4" → "px-4"), conditional (false, undefined, null filtered), empty call returns ""
- [ ] T032 [P] [US3] Create unit tests for jsonTextToHtml() in lib/__tests__/text-utils.test.tsx — multi-line text produces correct number of `<p>` elements, single line produces one `<p>`, empty string produces empty array, whitespace-only lines filtered
- [ ] T033 [P] [US3] Create locale loading tests in lib/__tests__/i18n.test.ts — verify all 4 locale files (en.json, it.json, de.json, fr.json) import successfully and contain expected top-level keys (hero, about, experience, education, academic, languages, skills, elsewhere, authorNote)

### Validation

- [ ] T034 [US3] Run `bun test lib/__tests__/` and verify all utility tests pass

**Checkpoint**: All 3 utility test files pass. User Story 3 is independently verified.

---

## Phase 5: User Story 4 — CI Pipeline Runs Tests on Every PR (Priority: P2)

**Goal**: GitHub Actions workflow runs the full test suite on every PR targeting main

**Independent Test**: Open a PR and confirm the test job runs and reports pass/fail status

### Implementation

- [ ] T035 [US4] Look up current commit SHA for oven-sh/setup-bun from GitHub (must pin to hash per project rules)
- [ ] T036 [US4] Create CI test workflow in .github/workflows/test.yml — triggers on PRs to main + push to main/feat/**; two jobs: `unit` (checkout, setup-bun, bun install --frozen-lockfile, bun test) and `e2e` (checkout, setup-bun, bun install, playwright install chromium, bun run test:e2e). Pin actions/checkout to de0fac2e4500dabe0009e67214ff5f5447ce83dd and oven-sh/setup-bun to looked-up hash. Add concurrency group and timeout-minutes.

**Checkpoint**: CI workflow file created. Verified on next PR push.

---

## Phase 6: User Story 1 — Dependabot PRs Auto-Merge Safely (Priority: P1)

**Goal**: Dependabot patch/minor PRs auto-merge when all CI checks pass; major bumps require manual review

**Independent Test**: Dependabot opens a PR → tests run → if pass, PR merges automatically

**Dependency**: Requires US4 (CI pipeline) to be complete so auto-merge has status checks to gate on

### Implementation

- [ ] T037 [US1] Look up current commit SHA for dependabot/fetch-metadata from GitHub (must pin to hash)
- [ ] T038 [US1] Create Dependabot auto-merge workflow in .github/workflows/dependabot-auto-merge.yml — triggers on pull_request from dependabot[bot]; uses dependabot/fetch-metadata to check update-type; runs `gh pr merge --auto --squash` only for semver-patch and semver-minor. Permissions: contents write, pull-requests write. Pin all actions to commit hashes.

### E2E Smoke Test

- [ ] T039 [US1] Create Playwright E2E smoke test in test/e2e/smoke.spec.ts — navigate to /en, verify page title contains "Sonny Monti", verify all section headings visible (About, Stack, Work Experience, Education, Academic Work, Languages, Elsewhere), click locale switcher to IT, verify URL changes to /it

**Checkpoint**: Auto-merge workflow + E2E test created. Full safety net in place.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates and final validation

- [ ] T040 [P] Update docs/specs.md — add "Testing" section covering: test runners (Vitest + RTL for unit/component, Playwright for E2E), content verification strategy (real translations, not mocked hooks), no snapshot/visual testing, test file location convention (__tests__/ co-located)
- [ ] T041 [P] Update AGENTS.md tech stack — add Testing group: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @playwright/test
- [ ] T042 Update AGENTS.md — add "Testing" subsection under Commands with `bun test`, `bun run test:e2e`, `bun run test:all`; update "Workflow for new features" to include writing tests; update Repository Structure to include test/, vitest.config.ts, playwright.config.ts, __tests__/ dirs; add testing rules section
- [ ] T043 [P] Update .claude/skills/update-techstack/SKILL.md — add Testing group row to grouping table: Testing | package.json | vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @playwright/test
- [ ] T044 Run markdownlint-cli2 on docs/specs.md and AGENTS.md, fix any violations
- [ ] T045 Run `bun test` — verify full test suite passes and completes under 60 seconds
- [ ] T046 Run `bun lint` — verify no ESLint errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all test files
- **US2 (Phase 3) + US3 (Phase 4)**: Both depend on Foundational — CAN run in parallel
- **US4 (Phase 5)**: Depends on US2 + US3 (tests must exist for CI to run them)
- **US1 (Phase 6)**: Depends on US4 (CI pipeline must exist for auto-merge to gate on)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US2 (P1)**: Components Render → depends on Foundational only
- **US3 (P2)**: Utility Tests → depends on Foundational only (parallel with US2)
- **US4 (P2)**: CI Pipeline → depends on US2 + US3 (needs test files to run)
- **US1 (P1)**: Auto-Merge → depends on US4 (needs CI checks for gating)

### Within Each User Story

- All test files within a story marked [P] can be written in parallel
- Validation task runs after all test files in that story are complete

### Parallel Opportunities

- T008-T012: All mock files can be created in parallel
- T014-T029: All component/utility/control/page test files can be written in parallel (within Phase 3)
- T031-T033: All utility test files can be written in parallel
- T040, T041, T043: Documentation updates can run in parallel

---

## Parallel Example: User Story 2

```text
# Launch all UI primitive tests in parallel:
Task T014: "ContentSection tests in components/ui/__tests__/content-section.test.tsx"
Task T015: "Card tests in components/ui/__tests__/card.test.tsx"
Task T016: "Button tests in components/ui/__tests__/button.test.tsx"

# Launch all section component tests in parallel:
Task T017-T025: All 9 section component test files (different files, no dependencies)

# Launch all control + page tests in parallel:
Task T026-T029: ThemeToggle, LanguageSwitcher, error, loading tests
```

---

## Implementation Strategy

### MVP First (User Story 2 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T013)
3. Complete Phase 3: User Story 2 (T014-T030)
4. **STOP and VALIDATE**: Run `bun test` — all component tests pass
5. Components are now protected against breaking dependency updates

### Incremental Delivery

1. Setup + Foundational → Test infrastructure ready
2. Add US2 (component tests) → Run `bun test` → Components protected (MVP!)
3. Add US3 (utility tests) → Run `bun test` → Utilities also protected
4. Add US4 (CI pipeline) → Push PR → Tests run automatically on every PR
5. Add US1 (auto-merge) → Dependabot PRs merge automatically when safe
6. Polish → Documentation reflects new testing workflow

### Note on Branch Protection

US1 (auto-merge) requires GitHub branch protection rules on `main` with "Require status checks to pass" enabled, including the `unit` and `e2e` jobs from test.yml. This is a GitHub settings change, not a code change. Document in PR description when merging this feature.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story from spec.md
- Use @test-fixing skill when tests fail during implementation
- Use @browser-automation skill patterns for Playwright E2E test (auto-wait, user-facing locators)
- Use @concise-planning if any task needs further breakdown
- Commit after each phase or logical group using conventional commits (type: `test` or `feat`)
- Stop at any checkpoint to validate story independently
