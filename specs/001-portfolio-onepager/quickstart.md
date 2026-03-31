# Quickstart: 001-portfolio-onepager

## Prerequisites

- Bun (latest)
- Node.js 20+ (for Next.js compatibility)

## Setup

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

## Key Commands

```bash
bun dev                    # Start dev server (http://localhost:3000)
bun build                  # Production build
bun lint                   # ESLint check
markdownlint-cli2 "**/*.md" # Markdown lint
```

## Project Layout (after implementation)

```text
app/
  [locale]/
    layout.tsx             # Locale-aware root layout (Noto Sans, theme provider)
    page.tsx               # Portfolio one-pager (all sections)
  globals.css              # Tailwind + theme variables
middleware.ts              # Accept-Language detection → locale redirect
messages/
  en.json                  # English strings (default)
  it.json                  # Italian strings (placeholder in v1)
  de.json                  # German strings (placeholder in v1)
  fr.json                  # French strings (placeholder in v1)
components/
  hero-section.tsx         # Video-text title + intro + hex-grid bg + portrait
  hex-grid-background.tsx  # Animated hexagonal grid canvas
  author-note.tsx          # Styled callout block
  about-section.tsx        # Professional bio
  timeline.tsx             # Scroll-animated career timeline
  education-section.tsx    # Two shadcn cards for degrees
  theme-toggle.tsx         # Light/dark mode switch
  language-switcher.tsx    # Locale toggle control
lib/
  i18n.ts                  # next-intl configuration
public/
  sonny_frontpage.heic     # Portrait source (served as WebP via <Image>)
```

## Development Workflow

1. Edit content in `messages/en.json` (source of truth for text)
2. Components in `components/` render data from message dictionaries
3. Test responsive layout at 320px, 768px, 1024px, 1440px, 2560px
4. Test dark mode via OS preference toggle or theme button
5. Test i18n by navigating directly to `/en`, `/it`, `/de`, `/fr`
6. Test reduced motion via browser DevTools → Rendering → Emulate prefers-reduced-motion
