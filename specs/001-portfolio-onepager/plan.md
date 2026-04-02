# Implementation Plan: Portfolio One-Pager

**Branch**: `001-portfolio-onepager` | **Date**: 2026-03-31 | **Spec**: `specs/001-portfolio-onepager/spec.md`
**Input**: Feature specification from `/specs/001-portfolio-onepager/spec.md`

## Summary

Replace the Next.js starter with Sonny Monti's personal portfolio one-pager.
The page includes an animated hex-grid background, MagicUI video-text hero,
fixed portrait, author's note, about section, education cards, and a
scroll-animated career timeline. Supports four languages via URL-based routing
(`/en`, `/it`, `/de`, `/fr`) and light/dark mode. Fully static — no backend.

## Technical Context

**Language/Version**: TypeScript 6 (strict mode)
**Primary Dependencies**: Next.js 16.2.1, React 19, Tailwind CSS v4, shadcn/ui,
MagicUI (video-text), next-intl, next-themes, framer-motion
**Storage**: N/A — fully static site, no database
**Testing**: ESLint (`bun lint`), markdownlint-cli2, manual visual testing
**Target Platform**: Web — all modern browsers, 320px–2560px viewports
**Project Type**: web-service (static Next.js site)
**Performance Goals**: Sub-3s LCP on 3G, 60fps animations on mid-range devices
**Constraints**: No backend, no API, no authentication. `prefers-reduced-motion`
must disable all animations. HEIC source converted at build time.
**Scale/Scope**: Single page, 4 locale variants, ~8 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Check

| Principle | Status | Evidence |
| --- | --- | --- |
| I. Human-Driven Architecture | PASS | All contracts (URL routing, data shapes) defined in spec by human author. No agent-invented endpoints. |
| II. Spec-Before-Code | PASS | Full spec completed via `/speckit.specify` → `/speckit.clarify`. Plan is current step. |
| III. Quality Gates | PASS | Plan requires `bun lint` + `markdownlint-cli2` + conventional commits on all changes. Branch is `001-portfolio-onepager` (not main). |
| IV. Security by Design | PASS | No secrets, no user input, no external-facing APIs. Static site only. Dependabot active. |
| V. Simplicity (YAGNI) | PASS | Dependencies justified: next-intl (i18n is a core requirement), framer-motion (spec-approved), next-themes (avoids FOIT reimplementation). No speculative abstractions. |

### Post-Phase 1 Re-Check

| Principle | Status | Evidence |
| --- | --- | --- |
| I. Human-Driven Architecture | PASS | URL routing contract and message dictionary shape defined in plan artifacts, not invented during implementation. |
| II. Spec-Before-Code | PASS | data-model.md, contracts/, research.md all completed before implementation. |
| III. Quality Gates | PASS | No changes to gate requirements. |
| IV. Security by Design | PASS | No new attack surface. Static content only. |
| V. Simplicity (YAGNI) | PASS | 8 components, flat structure, no abstractions beyond what's needed. See Complexity Tracking — no violations. |

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-onepager/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology decisions
├── data-model.md        # Phase 1 output — entity shapes
├── quickstart.md        # Phase 1 output — dev setup guide
├── contracts/
│   └── url-routing.md   # Phase 1 output — URL routing contract
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
app/
  [locale]/
    layout.tsx             # Locale-aware root layout (Noto Sans, next-themes)
    page.tsx               # Portfolio one-pager (composes all sections)
  globals.css              # Tailwind v4 + theme CSS variables
middleware.ts              # Accept-Language → locale redirect
messages/
  en.json                  # English strings (source of truth)
  it.json                  # Italian (placeholder = English copy in v1)
  de.json                  # German (placeholder = English copy in v1)
  fr.json                  # French (placeholder = English copy in v1)
components/
  hero-section.tsx         # Video-text title + intro phrase
  hex-grid-background.tsx  # Animated hexagonal grid (canvas)
  author-note.tsx          # Styled callout block
  about-section.tsx        # Professional bio paragraph
  timeline.tsx             # Scroll-animated career timeline (framer-motion)
  education-section.tsx    # Two shadcn cards for degrees
  theme-toggle.tsx         # Light/dark mode switch
  language-switcher.tsx    # Locale toggle (links to /en, /it, /de, /fr)
lib/
  i18n.ts                  # next-intl request config
public/
  sonny_frontpage.heic     # Portrait source master
```

**Structure Decision**: Next.js App Router with `[locale]` dynamic segment.
Components live in a flat `components/` directory (no nesting — only 8 files).
No `lib/` beyond a single i18n config. No `types/` directory — interfaces
defined inline or co-located. This is the simplest structure that satisfies
all requirements.

## Complexity Tracking

> No violations. All dependencies are justified by concrete requirements.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| (none)    | —          | —                                    |

## New Dependencies

| Package | Purpose | Spec Reference |
| --- | --- | --- |
| `next-intl` | i18n routing + message dictionaries | FR-007 |
| `next-themes` | Dark/light mode with OS detection | FR-008 |
| `framer-motion` | Scroll-triggered timeline animations | FR-005 (approved in Assumptions) |
| shadcn/ui (init) | Card components for education | FR-006 |
| `@magicui/video-text` | Video-text hero heading | FR-002 |

## Phase Summary

- **Phase 0** (research.md): All technology decisions resolved. No NEEDS
  CLARIFICATION items remain.
- **Phase 1** (data-model.md, contracts/, quickstart.md): Entity shapes,
  URL routing contract, and developer setup documented.
- **Phase 2** (tasks.md): To be generated by `/speckit.tasks`.
