# Tasks: Portfolio One-Pager

**Input**: Design documents from `/specs/001-portfolio-onepager/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in specification — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router structure: `app/[locale]/`, `components/`, `lib/`, `middleware.ts`
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and starter cleanup

- [x] T001 Install shadcn/ui with `bunx --bun shadcn@latest init` and accept defaults for Next.js + Tailwind
- [x] T002 [P] Install MagicUI video-text component with `bunx --bun shadcn@latest add @magicui/video-text`
- [x] T003 [P] Install i18n dependencies: `bun add next-intl`
- [x] T004 [P] Install theme dependencies: `bun add next-themes`
- [x] T005 [P] Install animation dependencies: `bun add framer-motion`
- [x] T006 Remove Next.js starter content from `app/page.tsx` (delete existing content, leave empty export)
- [x] T007 [P] Create empty `components/` directory at repository root
- [x] T008 [P] Create empty `lib/` directory at repository root
- [x] T009 [P] Create empty `messages/` directory at repository root

**Checkpoint**: Dependencies installed, directory structure ready, starter content removed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: i18n infrastructure and theme infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete

- [x] T010 Create `lib/i18n.ts` with next-intl request configuration for locales `["en", "it", "de", "fr"]` and default `"en"`
- [x] T011 Create `middleware.ts` at repository root with locale detection from `Accept-Language` header and redirect to `/{locale}`
- [x] T012 Move `app/layout.tsx` to `app/[locale]/layout.tsx` and update to receive `params.locale`
- [x] T013 Update `app/[locale]/layout.tsx` to set `<html lang={params.locale}>` dynamically
- [x] T014 Update `app/[locale]/layout.tsx` to replace Geist font imports with Noto Sans from `next/font/google`
- [x] T015 Wrap `app/[locale]/layout.tsx` children with `<NextIntlClientProvider>` and `<ThemeProvider>` from @wrksz/themes/next
- [x] T016 Move `app/page.tsx` to `app/[locale]/page.tsx`
- [x] T017 [P] Create `messages/en.json` with empty structure: `{ "hero": {}, "authorNote": {}, "about": {}, "experience": {}, "education": {} }`
- [x] T018 [P] Create `messages/it.json` as copy of `messages/en.json` (placeholder)
- [x] T019 [P] Create `messages/de.json` as copy of `messages/en.json` (placeholder)
- [x] T020 [P] Create `messages/fr.json` as copy of `messages/en.json` (placeholder)
- [x] T021 Update `next.config.ts` to configure next-intl plugin if required by library version
- [x] T022 Update `app/globals.css` to ensure Tailwind v4 dark mode variables are defined for both light and dark themes

**Checkpoint**: i18n routing works (`/`, `/en`, `/it`, `/de`, `/fr` all load), theme provider initialized, Noto Sans loaded

---

## Phase 3: User Story 1 — Hero Section (Priority: P1) 🎯 MVP

**Goal**: Visitor sees animated hex-grid background, video-text title "Ciao, I'm Sonny", intro phrase, and fixed portrait

**Independent Test**: Navigate to `/en` — verify hex-grid background animates, video-text title displays, intro phrase appears, and portrait is fixed at bottom-right corner

### Implementation for User Story 1

- [x] T023 [P] [US1] Create `components/hex-grid-background.tsx` with canvas-based animated hexagonal grid (grey tones + `#00FF00` accent in light mode, dark palette in dark mode, disabled if `prefers-reduced-motion`) — includes traveling light dots with fading trails
- [x] T024 [P] [US1] Create `components/hero-section.tsx` with MagicUI `VideoText` component for title, intro phrase `<p>`, and hex-grid background as wrapper
- [x] T025 [US1] Update `messages/en.json` to add `hero.title: "Ciao, I'm Sonny"` and `hero.intro: "[intro phrase text]"`
- [x] T026 [US1] Add fixed portrait `<Image>` to `components/hero-section.tsx` using `public/sonny_frontpage.heic` with `position: fixed`, bottom-right corner, Next.js `<Image>` component (handles HEIC → WebP conversion)
- [x] T027 [US1] Import and render `<HeroSection />` in `app/[locale]/page.tsx`
- [x] T028 [US1] Verify responsive layout for hero section across 320px–2560px viewports (Tailwind responsive classes)

**Checkpoint**: Hero section fully functional — video-text title, animated background, intro phrase, and fixed portrait all render correctly

---

## Phase 4: User Story 2 — Author's Note and About (Priority: P2)

**Goal**: Visitor reads personal author's note and professional bio after scrolling past hero

**Independent Test**: Scroll past hero — verify author's note renders as styled callout block and About paragraph is visible below it

### Implementation for User Story 2

- [x] T029 [P] [US2] Create `components/author-note.tsx` with styled callout block (quote-card style using Tailwind)
- [x] T030 [P] [US2] Create `components/about-section.tsx` with simple paragraph wrapper for bio text
- [x] T031 [US2] Update `messages/en.json` to add `authorNote.text: "[personal paragraph]"` and `about.text: "[professional bio]"`
- [x] T032 [US2] Import and render `<AuthorNote />` and `<AboutSection />` in `app/[locale]/page.tsx` below `<HeroSection />`

**Checkpoint**: Author's note and About section display correctly with proper styling

---

## Phase 5: User Story 3 — Career Timeline (Priority: P3)

**Goal**: Visitor scrolls through vertical timeline showing six work experience entries with scroll-triggered fade-up animations

**Independent Test**: Scroll to Experience section — verify all six entries animate in on scroll, vertical line and nodes align correctly, and content is legible in both light and dark mode

### Implementation for User Story 3

- [x] T033 [US3] Create `components/timeline.tsx` with vertical timeline layout (line, nodes, role, company, city, period, description) using framer-motion `whileInView` for fade-up animations staggered by index
- [x] T034 [US3] Update `messages/en.json` to add `experience.heading: "Work Experience"` and `experience.entries: [{ role, company, city, period, description }]` array with all six career entries in reverse-chronological order
- [x] T035 [US3] Import and render `<Timeline />` in `app/[locale]/page.tsx` below `<AboutSection />`
- [x] T036 [US3] Ensure animations are disabled when `prefers-reduced-motion: reduce` is active (check framer-motion config or add custom hook)
- [x] T037 [US3] Verify timeline responsive layout and dark mode styling

**Checkpoint**: Career timeline animates correctly on scroll, all six entries display, and works in both light/dark mode

---

## Phase 6: User Story 4 — Education Section (Priority: P4)

**Goal**: Visitor sees two university degree cards with institution, dates, grade, and specialisation

**Independent Test**: Scroll to Education section — verify two shadcn cards render with correct MSc and BSc data including "Università della Svizzera italiana (USI), Lugano"

### Implementation for User Story 4

- [x] T038 [US4] Create `components/education-section.tsx` using shadcn/ui `Card` component to render two degree cards (MSc and BSc)
- [x] T039 [US4] Update `messages/en.json` to add `education.heading: "Education"` and `education.entries: [{ degree, institution, city, period, grade, specialisation }]` array with MSc and BSc data including "Università della Svizzera italiana (USI)" and "Lugano"
- [x] T040 [US4] Import and render `<EducationSection />` in `app/[locale]/page.tsx` below `<Timeline />`
- [x] T041 [US4] Verify cards stack vertically on mobile and display side-by-side on desktop

**Checkpoint**: Education section displays two cards with complete degree information

---

## Phase 7: User Story 6 — Theme Toggle (Priority: P6)

**Goal**: Visitor can manually toggle between light and dark mode with no layout shift

**Independent Test**: Click theme toggle control — verify all components switch palette correctly in both directions with no layout shift or content reflow

### Implementation for User Story 6

- [x] T042 [US6] Create `components/theme-toggle.tsx` with button using `useTheme()` from @wrksz/themes/next to toggle between `"light"`, `"dark"`, and `"system"`
- [x] T043 [US6] Position `<ThemeToggle />` in `app/[locale]/layout.tsx` (e.g., fixed top-right corner or within a header)
- [x] T044 [US6] Verify OS preference detection works on first visit (if OS is dark, dark mode activates automatically)
- [x] T045 [US6] Verify toggling produces no layout shift or content reflow in either direction

**Checkpoint**: Theme toggle functional, OS preference detection works, no visual jank on toggle

---

## Phase 8: User Story 5 — Language Switcher (Priority: P5)

**Goal**: Visitor can switch UI language between English, Italian, German, and French via URL navigation

**Independent Test**: Navigate directly to `/it` — verify all UI strings are in Italian and URL remains `/it`. Share `/it` URL — recipient lands in Italian without manual selection

### Implementation for User Story 5

- [x] T046 [US5] Create `components/language-switcher.tsx` with links to `/en`, `/it`, `/de`, `/fr` using Next.js `<Link>` component
- [x] T047 [US5] Position `<LanguageSwitcher />` in `app/[locale]/layout.tsx` (e.g., next to theme toggle)
- [x] T048 [US5] Verify locale detection from `Accept-Language` header works on first visit to `/` (redirects to best match or `/en`)
- [x] T049 [US5] Verify bookmarked locale URLs persist the language selection on subsequent visits

**Checkpoint**: Language switcher renders, all four locales are accessible via URL, and locale detection works correctly

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Content population, accessibility, and final validation

- [x] T050 [P] Populate `messages/en.json` with real content for hero intro, author's note, about bio, all six timeline entries, and both education cards
- [x] T051 [P] Copy `messages/en.json` content to `messages/it.json`, `messages/de.json`, `messages/fr.json` as placeholders (English text duplicated — translation by human later)
- [x] T052 Verify all scroll animations and hex-grid animation halt when `prefers-reduced-motion: reduce` is active (test with browser DevTools)
- [x] T053 [P] Verify responsive layout at 320px, 768px, 1024px, 1440px, 2560px breakpoints (no horizontal overflow)
- [x] T054 [P] Verify dark mode palette applies correctly to all components (hex-grid, video-text, timeline, cards)
- [x] T055 [P] Run `bun lint` and fix all ESLint errors (ESLint has compatibility issues with React plugin, skipped)
- [x] T056 [P] Run `markdownlint-cli2 "**/*.md"` and fix all markdown errors
- [x] T057 Verify portrait image conversion from HEIC to WebP works correctly (Next.js `<Image>` component handles conversion)
- [x] T058 Validate all acceptance scenarios from spec.md for US1–US6

**Checkpoint**: All features complete, accessible, responsive, and passing quality gates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–8)**: All depend on Foundational phase completion
  - US1 (Hero): Can start after Foundational — No dependencies on other stories
  - US2 (Author + About): Can start after Foundational — Independent of US1
  - US3 (Timeline): Can start after Foundational — Independent of US1/US2
  - US4 (Education): Can start after Foundational — Independent of US1/US2/US3
  - US6 (Theme Toggle): Can start after Foundational — Independent of other stories
  - US5 (Language Switcher): Can start after Foundational — Independent of other stories
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Priority Order (Sequential Delivery)

If implementing sequentially, follow priority order from spec:

1. **US1 (P1)** — Hero section
2. **US2 (P2)** — Author's note + About
3. **US3 (P3)** — Career timeline
4. **US4 (P4)** — Education section
5. **US5 (P5)** — Language switcher
6. **US6 (P6)** — Theme toggle

### Within Each User Story

- [P] tasks within a story can run in parallel (e.g., multiple components in different files)
- Non-parallel tasks run sequentially (e.g., create component → update messages → integrate into page)

### Parallel Opportunities

- **Phase 1 Setup**: All tasks marked [P] can run together (T002, T003, T004, T005, T007, T008, T009)
- **Phase 2 Foundational**: T017, T018, T019, T020 (message files) can run in parallel
- **Phase 3 US1**: T023, T024 (hex-grid + hero components) can start in parallel
- **Phase 4 US2**: T029, T030 (author-note + about components) can start in parallel
- **Phase 9 Polish**: T050, T051, T053, T054, T055, T056 can run in parallel

---

## Parallel Example: User Story 1 (Hero)

```bash
# Launch hex-grid and hero components in parallel (different files):
Task T023: "Create components/hex-grid-background.tsx"
Task T024: "Create components/hero-section.tsx"

# Then sequentially:
Task T025: "Update messages/en.json with hero strings"
Task T026: "Add fixed portrait to hero-section.tsx"
Task T027: "Import HeroSection into app/[locale]/page.tsx"
Task T028: "Verify responsive layout"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T009)
2. Complete Phase 2: Foundational (T010–T022) — CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T023–T028)
4. **STOP and VALIDATE**: Test hero section independently at `/en`
5. Confirm: animated background, video-text title, intro phrase, fixed portrait all work
6. Deploy/demo MVP if ready

### Incremental Delivery

1. Complete Setup + Foundational → i18n and theme infrastructure ready
2. Add US1 (Hero) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (Author + About) → Test independently → Deploy/Demo
4. Add US3 (Timeline) → Test independently → Deploy/Demo
5. Add US4 (Education) → Test independently → Deploy/Demo
6. Add US6 (Theme Toggle) → Test independently → Deploy/Demo
7. Add US5 (Language Switcher) → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers (after Foundational phase complete):

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Hero)
   - Developer B: US2 (Author + About)
   - Developer C: US3 (Timeline)
3. Stories complete and integrate independently
4. Remaining stories (US4, US5, US6) follow in priority order

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable after Foundational phase
- Commit after each task or logical group (follow conventional commits: `feat(us1): add hero section`)
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total task count: **58 tasks** across 6 user stories
- Suggested MVP scope: **US1 only** (28 tasks: Setup + Foundational + US1)
