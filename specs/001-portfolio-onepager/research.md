# Research: 001-portfolio-onepager

**Date**: 2026-03-31

## R-001: i18n Routing Strategy (Next.js 16 App Router)

**Decision**: Use `next-intl` with App Router `[locale]` dynamic segment.

**Rationale**: `next-intl` is the de-facto i18n library for Next.js App Router. It
provides middleware-based `Accept-Language` detection, URL-segment routing (`/en`,
`/it`, `/de`, `/fr`), and static message dictionaries — all required by FR-007.
Next.js 16 has no built-in i18n for App Router (the legacy `i18n` config only
applied to Pages Router).

**Alternatives considered**:

- **Manual middleware + React context**: Lower dependency count, but requires
  reimplementing locale negotiation, message loading, and SSR hydration. Violates
  Constitution V (YAGNI inverted — building what a library already provides).
- **next-translate**: Less active maintenance, weaker App Router support.

**Implementation shape**:

```text
app/
  [locale]/
    layout.tsx      ← receives params.locale, sets <html lang>
    page.tsx        ← portfolio one-pager
middleware.ts       ← Accept-Language detection → redirect to /en|/it|/de|/fr
messages/
  en.json
  it.json
  de.json
  fr.json
```

## R-002: MagicUI video-text Component

**Decision**: Install via `bunx --bun shadcn@latest add @magicui/video-text`.

**Rationale**: MagicUI is a shadcn-compatible registry. The `video-text` component
renders text with a video playing through the letter shapes via CSS `mix-blend-mode`
or SVG clip-path. It requires shadcn/ui to be initialised first (`components.json`).

**Alternatives considered**:

- **Custom CSS clip-path implementation**: Possible but fragile across browsers
  and fonts; violates Constitution V (reimplementing what a library provides).

**Prerequisites**:

1. Initialise shadcn/ui: `bunx --bun shadcn@latest init`
2. Install video-text: `bunx --bun shadcn@latest add @magicui/video-text`

## R-003: Animated Hexagonal Grid Background

**Decision**: Use a lightweight custom Canvas/SVG component or a MagicUI background
component if available. Research MagicUI registry for hex-grid patterns first.

**Rationale**: FR-001 requires an animated hex-grid background with `#00FF00` accent
in light mode and dark palette adaptation. MagicUI has several animated background
components (e.g., `dot-pattern`, `grid-pattern`). If no hex-grid exists, a custom
`<canvas>` component drawing hexagons with requestAnimationFrame is the simplest
approach. Must respect `prefers-reduced-motion` (FR-011).

**Alternatives considered**:

- **CSS-only hex grid**: Limited animation capability, hard to achieve the accent
  glow effect.
- **Three.js**: Massive overkill for a 2D hex grid; violates Constitution V.

## R-004: Scroll-Triggered Timeline Animations

**Decision**: Use `framer-motion` with `useInView` or `whileInView`.

**Rationale**: The spec explicitly lists framer-motion as an acceptable dependency
(Assumptions section). It provides `whileInView` for scroll-triggered fade-up
animations with stagger, which directly satisfies FR-005. Must be disabled when
`prefers-reduced-motion` is active (FR-011).

**Alternatives considered**:

- **Intersection Observer + CSS transitions**: Lower dependency count but requires
  manual stagger logic and reduced-motion handling. Acceptable but framer-motion
  is already approved.

## R-005: HEIC Image Handling

**Decision**: Use Next.js `<Image>` component with the HEIC source.

**Rationale**: Per spec clarification, Next.js `<Image>` handles format conversion
at build/request time. The HEIC file in `public/sonny_frontpage.heic` is the
source master. The `sharp` library (already in trustedDependencies) handles
conversion. The image is fixed-position at bottom-right (FR-003).

**Caveat**: Next.js `<Image>` with `fill` or explicit dimensions + CSS
`position: fixed` will handle the fixed viewport positioning. Need to verify
sharp supports HEIC input (it does via libvips).

## R-006: Dark/Light Mode Implementation

**Decision**: Use `next-themes` with Tailwind CSS v4 dark mode class strategy.

**Rationale**: `next-themes` handles OS preference detection (`prefers-color-scheme`),
theme persistence, and hydration-safe rendering. Tailwind v4 supports
`@variant dark` via class strategy. This satisfies FR-008.

**Alternatives considered**:

- **Manual CSS custom properties + matchMedia**: Works but requires solving
  flash-of-wrong-theme (FOIT) which `next-themes` already handles.

## R-007: Font Loading — Noto Sans

**Decision**: Use `next/font/google` with Noto Sans.

**Rationale**: Per spec clarification, `next/font/google` self-hosts fonts at build
time with zero layout shift. Replace the current Geist font imports in layout.tsx
with Noto Sans (FR-009).
