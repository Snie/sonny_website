# Feature Specification: One-Pager Portfolio Website

**Feature Branch**: `001-portfolio-onepager`
**Created**: 2026-03-31
**Status**: Draft
**Input**: User description: replace Next.js starter with Sonny Monti's personal portfolio one-pager

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor gets a first impression from the hero (Priority: P1)

A visitor lands on the page and immediately understands who Sonny is and what he
does. The visual hero (animated background, video-text title, intro phrase, and
fixed portrait) delivers this within seconds, before any scrolling.

**Why this priority**: The hero is the centrepiece of the entire page. If it is
broken or missing, no other section matters. It also establishes every visual
convention (colours, font, theme) used by all later sections.

**Independent Test**: Navigate to `/` on any device. Verify the animated hex-grid
background renders, the `Ciao, I'm Sonny` video-text title plays, the intro phrase
appears below it, and the portrait floats in the bottom-right corner.

**Acceptance Scenarios**:

1. **Given** the visitor opens the page, **When** it loads, **Then** the animated
   hexagonal grid background is visible behind all content.
2. **Given** the page has loaded, **When** the visitor views the hero area,
   **Then** the MagicUI `video-text` component displays "Ciao, I'm Sonny"
   with the specified video playing through the lettering.
3. **Given** the page has loaded, **When** the visitor inspects the bottom-right
   corner, **Then** the portrait image (`sonny_frontpage.heic`) is visible,
   fixed in position, and does not scroll away.
4. **Given** any screen width from 320 px to 2560 px, **When** the hero renders,
   **Then** all elements are readable and nothing overflows or overlaps.
5. **Given** the OS preference is dark mode, **When** the page first loads,
   **Then** dark mode is active and the background palette is dark.

---

### User Story 2 — Visitor reads personal story and professional bio (Priority: P2)

After the hero the visitor reads Sonny's candid author's note and professional
About bio, forming a complete picture of his identity, values, and expertise.

**Why this priority**: These two prose blocks add depth and personality that
the hero title alone cannot convey. They are self-contained and render with no
interactive dependencies.

**Independent Test**: Scroll past the hero. Verify the author's note renders
as a visually distinct styled callout and the About paragraph appears below it.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls past the hero, **When** they reach the note
   section, **Then** the author's note text is displayed in a visually distinct
   styled block (quote-card style).
2. **Given** the visitor continues scrolling, **When** they reach About,
   **Then** the full professional bio paragraph is visible and readable.

---

### User Story 3 — Visitor explores the career timeline (Priority: P3)

The visitor scrolls through a vertical timeline showing Sonny's work history in
reverse-chronological order. Each entry animates into view as it enters the
viewport, creating a narrative sense of progression.

**Why this priority**: The timeline is the richest and most technically complex
section; shipping it after the hero and bio keeps risk contained.

**Independent Test**: Scroll to the Experience section. Verify all six entries
appear with correct data, each fades/slides in on scroll, and the layout is
correct in both light and dark mode.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls to the Experience section, **When** each entry
   enters the viewport, **Then** it animates in with a fade-up motion staggered
   by index.
2. **Given** the page is in dark mode, **When** the timeline is visible, **Then**
   all text and decorative elements are legible against the dark background.
3. **Given** any screen width, **When** the timeline renders, **Then** the
   vertical line, circular nodes, roles, companies, and dates are properly aligned.

---

### User Story 4 — Visitor views education credentials (Priority: P4)

The visitor sees Sonny's two university degrees presented as cards with institution,
dates, grade, and specialisation clearly displayed.

**Why this priority**: Straightforward content; depends only on shadcn card
components already available.

**Independent Test**: Scroll to the Education section. Verify two shadcn cards
render with correct MSc and BSc data including the USI Lugano name.

**Acceptance Scenarios**:

1. **Given** the visitor reaches Education, **When** they view the cards, **Then**
   both MSc and BSc entries show institution, city, period, grade, and specialisation.
2. **Given** a mobile viewport, **When** the education cards render, **Then** the
   cards stack vertically and remain fully readable.

---

### User Story 5 — Visitor switches the display language (Priority: P5)

The visitor switches the UI language from English (default) to Italian, German,
or French. Each language lives at its own URL segment (`/en`, `/it`, `/de`, `/fr`).
On first visit the browser's `Accept-Language` header determines the initial
redirect; the URL itself persists the selection on subsequent visits.

**Why this priority**: Multilanguage is an architectural cross-cutting concern that
must be present from the start, but full translation content can follow later.

**Independent Test**: Navigate directly to `/it`. Verify all UI strings are in
Italian. Navigate to `/en`. Verify English. Share the `/it` URL and verify the
recipient lands in Italian without any further interaction.

**Acceptance Scenarios**:

1. **Given** the visitor navigates to `/it`, **When** the page loads, **Then**
   all UI strings are in Italian and the URL remains `/it`.
2. **Given** a language URL is bookmarked or shared, **When** any visitor opens
   it, **Then** that language is displayed without requiring a manual selection.
3. **Given** a first-time visitor with browser language set to German arrives at
   `/`, **When** the page loads, **Then** they are automatically redirected to
   `/de`.
4. **Given** a first-time visitor whose browser language is not supported (e.g.
   Japanese), **When** they arrive at `/`, **Then** they are redirected to `/en`.

---

### User Story 6 — Visitor toggles light / dark mode (Priority: P6)

The visitor can manually switch between light and dark mode. The animated
background, all text, and all components adapt without layout shifts.

**Why this priority**: Cosmetic concern; depends on the design system being stable.

**Independent Test**: Toggle the theme control. Verify the background and all
components switch palette correctly in both directions.

**Acceptance Scenarios**:

1. **Given** the page is in light mode, **When** the visitor activates dark mode,
   **Then** all components switch palette with no layout shift.
2. **Given** the visitor's OS preference is dark, **When** they first visit,
   **Then** dark mode is already active.

---

### Edge Cases

- If `sonny_frontpage.heic` fails to load or WebP conversion fails at build
  time, the bottom-right corner is empty with no broken-image indicator shown.
- If the video source for `video-text` is unavailable, the title text renders
  as a static styled fallback.
- If `prefers-reduced-motion` is active, all scroll-triggered animations and
  the hex-grid animation halt immediately.
- If a translation key is missing for the selected language, the English string
  is shown as a fallback with no visible error.

## Clarifications

### Session 2026-03-31

- Q: Should SEO meta tags be included in v1? → A: No — explicitly out of scope.
- Q: Should contact / social links be included in v1? → A: No — explicitly
  out of scope; page ends after the Work Experience timeline.
- Q: How should Noto Sans be loaded? → A: `next/font/google` — self-hosted at
  build time, no CDN requests, zero layout shift.
- Q: How should the HEIC portrait image be handled for cross-browser support? → A:
  Serve via Next.js `<Image>` which converts HEIC to WebP automatically; HEIC
  remains the source master.
- Q: How should language selection be persisted and routed? → A: URL-based routing
  (`/en`, `/it`, `/de`, `/fr`) with automatic browser language detection on first
  visit via `Accept-Language` header redirect.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display an animated hexagonal grid background.
  In light mode the grid MUST use grey tones with a semi-transparent `#00FF00`
  accent colour; it MUST adapt to the dark palette in dark mode.
- **FR-002**: The page MUST display the heading "Ciao, I'm Sonny" using the
  MagicUI `video-text` component with the specified YouTube video as the fill.
- **FR-003**: The portrait image at `public/sonny_frontpage.heic` MUST be fixed
  at the bottom-right corner of the viewport and MUST NOT scroll with the page.
  The image MUST be served in a universally supported format (WebP) via the
  Next.js `<Image>` component, which handles the HEIC → WebP conversion
  automatically; the HEIC file remains the source master in `public/`.
- **FR-004**: The page MUST include, in order: hero (title + intro phrase),
  author's note, About section, Education section (two degree cards), and
  Work Experience timeline (six entries).
- **FR-005**: The work experience timeline MUST contain all six career entries
  in reverse-chronological order with scroll-triggered fade-up animations
  staggered by entry index.
- **FR-006**: The education section MUST render two shadcn cards for the MSc
  and BSc degrees, each clearly showing Università della Svizzera italiana
  (USI), Lugano, as the institution.
- **FR-007**: The page MUST support four languages via URL-based routing:
  `/en` (default), `/it`, `/de`, `/fr`. On first visit the server MUST
  read the browser's `Accept-Language` header and redirect to the best
  matching locale; unsupported locales fall back to `/en`. The URL itself
  persists the language selection.
- **FR-008**: The page MUST support light and dark mode. Dark mode MUST activate
  automatically when the visitor's OS preference is dark.
- **FR-009**: The page MUST use Noto Sans as the primary typeface across all text
  elements, loaded via `next/font/google` (self-hosted at build time, no external
  font requests at runtime, zero layout shift).
- **FR-010**: The layout MUST be centred and fully responsive across viewports
  from 320 px to 2560 px wide with no horizontal overflow.
- **FR-011**: All scroll animations and background animations MUST be disabled
  when `prefers-reduced-motion: reduce` is active.
- **FR-012**: All existing Next.js starter/demo content MUST be removed before
  the portfolio page is built.
- **FR-013** *(out of scope — v1)*: Contact form, email link, and social media
  links are explicitly excluded from v1. The page ends after the Work Experience
  timeline with no footer links.
- **FR-014** *(out of scope — v1)*: SEO meta tags (`<title>`, `<meta
  name="description">`, Open Graph tags) are explicitly excluded from v1.

### Key Entities

- **HeroSection**: Video-text title, intro phrase, animated hex-grid background,
  fixed portrait image.
- **AuthorNote**: Candid personal paragraph rendered as a styled callout block.
- **AboutSection**: Professional bio prose block.
- **TimelineEntry**: `{ role, company, city, period, description }` — six
  instances in reverse-chronological order.
- **EducationCard**: `{ degree, institution, city, period, grade, specialisation }`
  — two instances (MSc, BSc).
- **LanguageSwitcher**: UI control for toggling between `en`, `it`, `de`, `fr`.
- **ThemeToggle**: UI control for toggling light / dark mode.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify Sonny's name, current role, and
  most recent employer within 5 seconds of the page loading — without scrolling.
- **SC-002**: All six timeline entries display correctly attributed data when
  scrolling through the Experience section on any device.
- **SC-003**: Language switching is perceived as instant — the visitor sees no
  loading spinner or content flash when toggling between the four languages.
- **SC-004**: The page renders without horizontal scrolling or overflow on any
  viewport from 320 px (small mobile) to 2560 px (large desktop).
- **SC-005**: Theme toggling produces no visible layout shift or content reflow
  in either direction.
- **SC-006**: When `prefers-reduced-motion` is active, no animations play,
  ensuring compliance with WCAG 2.1 Success Criterion 2.3.3.

## Assumptions

- `public/sonny_frontpage.heic` is already present in the repository and is the
  correct portrait to display. Format conversion to WebP is handled automatically
  by the Next.js `<Image>` component at build/request time; no manual conversion
  is required.
- The MagicUI `video-text` component is installable via
  `bunx --bun shadcn@latest add @magicui/video-text` with no extra configuration.
- The specified YouTube video URL will remain publicly accessible; no
  download or self-hosting of the video is required.
- Italian, German, and French translation strings will be supplied by Sonny at
  a later stage; placeholder strings duplicating English are acceptable for v1.
- This is a fully static site — no backend, database, or authentication is needed.
- framer-motion is an acceptable dependency for timeline animations alongside
  shadcn/ui; no additional animation library will be introduced.
- The existing Next.js starter branch (`feature/nextjs`) is the starting point;
  all starter demo files can be deleted without preserving any content.
