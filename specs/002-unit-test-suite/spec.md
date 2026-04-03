# Feature Specification: Unit Test Suite for Dependabot Safety

**Feature Branch**: `002-unit-test-suite`
**Created**: 2026-04-03
**Status**: Draft
**Input**: User description: "This website needs tests, I am not sure if we need integration and E2E tests since the page is static, I need more unit tests. The main reason is because I have dependabot to update node modules, and I want automatic pull requests merging if the tests pass, because I do not want to break the website with automatic updates."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dependabot PRs Auto-Merge Safely (Priority: P1)

As the site owner, I want dependency update pull requests to be automatically merged only when all tests pass, so that automated updates never silently break the live website.

**Why this priority**: This is the core motivation for the entire feature. Without automated test gating, Dependabot PRs either pile up awaiting manual review or get merged blindly, risking a broken site.

**Independent Test**: Can be verified by simulating a dependency update that introduces a breaking change (e.g., a renamed export) and confirming the test suite catches the failure before merge.

**Acceptance Scenarios**:

1. **Given** a Dependabot PR that updates a compatible dependency, **When** the CI pipeline runs the test suite, **Then** all tests pass and the PR is eligible for auto-merge.
2. **Given** a Dependabot PR that introduces a breaking change (e.g., a component fails to render), **When** the CI pipeline runs the test suite, **Then** at least one test fails and the PR is blocked from merging.
3. **Given** a Dependabot PR is opened, **When** tests pass successfully, **Then** the PR is automatically merged without manual intervention.

---

### User Story 2 - Components Render Without Errors (Priority: P1)

As the site owner, I want every visible section of my portfolio to be covered by a render test, so that I am confident no dependency update causes a component to crash or fail to mount.

**Why this priority**: Render tests are the minimum viable safety net. If a component cannot render at all after an update, the site is broken. This is equally critical to the auto-merge workflow.

**Independent Test**: Can be verified by running the test suite and confirming each section component renders without throwing errors given valid translation data.

**Acceptance Scenarios**:

1. **Given** valid translation data, **When** each section component is rendered in isolation, **Then** it mounts successfully without errors and displays the expected text content from translations.
2. **Given** a dependency update causes a component to render as empty or with missing content, **When** the render test runs, **Then** the test fails because expected text content is absent.
3. **Given** a dependency update changes the API of a UI library, **When** a component that depends on that library is rendered, **Then** the test fails with a clear error indicating what broke.

---

### User Story 3 - Utility Functions Produce Correct Output (Priority: P2)

As the site owner, I want utility and helper functions to be tested for correctness, so that shared logic like class merging and text parsing does not silently break after updates.

**Why this priority**: Utilities are used across many components. A subtle bug in a utility can cascade across the entire site without an obvious render failure.

**Independent Test**: Can be verified by running unit tests for each utility function with known inputs and asserting expected outputs.

**Acceptance Scenarios**:

1. **Given** a set of class name strings, **When** the `cn()` utility is called, **Then** it returns the correctly merged and deduplicated class string.
2. **Given** a multi-line text string, **When** `jsonTextToHtml()` is called, **Then** it returns the correct array of paragraph elements.
3. **Given** an empty or null input, **When** a utility function is called, **Then** it handles the edge case gracefully without throwing.

---

### User Story 4 - CI Pipeline Runs Tests on Every PR (Priority: P2)

As the site owner, I want a CI pipeline that runs the full test suite on every pull request, so that no code (human or automated) reaches the main branch without passing tests.

**Why this priority**: Without CI integration, tests only provide value when run manually. The auto-merge workflow depends on CI enforcement.

**Independent Test**: Can be verified by opening a PR and confirming the test job runs and reports its status back to the PR checks.

**Acceptance Scenarios**:

1. **Given** a pull request is opened or updated, **When** the CI pipeline triggers, **Then** the test suite runs to completion and reports pass/fail status.
2. **Given** the test suite fails, **When** the CI reports back, **Then** the PR is marked as failing checks and cannot be merged.

---

### Edge Cases

- What happens when a component depends on browser-only APIs (e.g., canvas, `window`, `IntersectionObserver`)? Tests must mock or skip these gracefully.
- What happens when translation keys are missing or malformed? Render tests should still pass if the component handles missing translations without crashing.
- What happens when a dynamic import (e.g., the chart component) fails to load in the test environment? The test must handle SSR-disabled components appropriately.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST have a test runner configured and executable via a single command.
- **FR-002**: Every section component (Hero, Author Note, About, Skills, Timeline, Education, Academic, Languages, Elsewhere) MUST have at least one render test that verifies it mounts without errors AND renders the complete expected text content from translation files.
- **FR-003**: UI primitive components (Card, Button, ContentSection) MUST have render tests verifying they accept and display their expected content slots.
- **FR-004**: Control components (ThemeToggle, LanguageSwitcher) MUST have render tests verifying they render interactive elements.
- **FR-005**: All utility functions (`cn`, `jsonTextToHtml`) MUST have unit tests covering normal inputs, edge cases, and empty/null inputs.
- **FR-006**: The i18n configuration MUST have a test verifying that all declared locales can load their message files successfully.
- **FR-007**: A CI workflow MUST run the full test suite on every pull request targeting the main branch.
- **FR-008**: Dependabot PRs for patch and minor version updates MUST be auto-merged when all CI checks (including tests) pass. Major version bumps MUST require manual review.
- **FR-009**: Components that use browser-only APIs (canvas, window resize listeners) MUST be testable in a non-browser environment through appropriate mocking or isolation.
- **FR-010**: The error boundary component and loading state MUST have render tests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of section components have at least one passing render test.
- **SC-002**: 100% of utility functions have unit tests covering at least 3 input scenarios each (normal, edge case, empty/invalid).
- **SC-003**: The full test suite completes in under 60 seconds on CI.
- **SC-004**: Dependabot PRs that pass all checks are merged automatically within 10 minutes of checks completing.
- **SC-005**: A simulated breaking dependency change (e.g., removing a required prop or export) is caught by at least one test before merge.
- **SC-006**: Zero manual intervention is required for routine, non-breaking dependency updates.

## Clarifications

### Session 2026-04-03

- Q: Should auto-merge apply to all Dependabot version bumps or only certain semver ranges? → A: Patch and minor only; major bumps require manual review.
- Q: Should render tests only verify mount success, or also assert expected content? → A: Full content verification — tests must confirm components render complete expected text content from translations.

## Assumptions

- The test environment will run in a simulated browser context (not a real browser), so components relying on Canvas, WebGL, or complex browser APIs will need mocking at the test level.
- Translation files for all four locales (en, it, de, fr) are complete and loadable; tests will use the default locale (English) unless specifically testing i18n.
- Dependabot is already configured in the repository and creates PRs for dependency updates.
- The CI platform is GitHub Actions, consistent with the existing `.github/` directory in the repository.
- Auto-merge for Dependabot will be limited to patch and minor version updates; major version bumps will still require manual review.
- The hex grid background component (canvas-based) will be tested for mount/unmount lifecycle only, not for visual rendering correctness.
- No snapshot testing or visual regression testing is in scope; the focus is on functional render and unit tests.
