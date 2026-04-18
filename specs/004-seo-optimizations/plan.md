# SEO 2026 + Doc Sync (`feat/seo`)

## Context

The Lighthouse/Google SEO score on the deployed site (`https://sonnymonti.com`)
is low. An audit of `feat/seo` against the `seo-audit` skill framework shows
the site has a strong **i18n routing foundation** and **per-locale metadata**,
but is missing nearly every other SEO surface: no `metadataBase`, no
`sitemap.ts`, no `robots.ts`, no JSON-LD, no favicons, no OG images, no `<h1>`
on the home page, and no semantic `<header>/<footer>` landmarks. Without
these, crawlers cannot resolve canonical URLs, social previews are blank, and
the site has no AEO/answer-engine signal — a major 2026 miss given that only
~12% of sites publish JSON-LD and AI Overviews now drive a meaningful share
of brand discovery.

This branch ships the missing surface area in one coherent change and refreshes
`README.md`/`AGENTS.md`/`CLAUDE.md` so they reflect reality (versions are stale;
`CLAUDE.md` "Recent Changes" duplicates and contradicts `AGENTS.md`).

Goal: take the SEO Health Index from roughly **52 (Poor)** to **≥ 80 (Good)**.

User decisions (captured in this session):

- **Production URL:** `https://sonnymonti.com`
- **OG images:** dynamic per-locale via `app/[locale]/opengraph-image.tsx`
  using Next.js `ImageResponse`
- **JSON-LD scope:** `Person` + `WebSite` + `ProfilePage`
- **Favicon:** code-generated monogram via `app/icon.tsx` + `app/apple-icon.tsx`
- **Brand accent:** **green** (matches `frontpage_green.webm` in dark mode)
- **Twitter/X:** none — do not add `twitter:creator` or include an X URL in
  `Person.sameAs`. The Twitter card meta itself is still useful (LinkedIn and
  others read it) and stays as `summary_large_image`.
- **LinkedIn:** `https://www.linkedin.com/in/sonnymonti/` (confirmed)
- **Bundle:** SEO + doc sync ship in one PR.

---

## SEO Health — Audit Snapshot (before changes)

Findings classified per `seo-audit`. Severity → Score Impact (before weighting).

| # | Issue | Category | Severity | Confidence | Score Impact |
|---|---|---|---|---|---|
| 1 | No `metadataBase` → all OG/canonical URLs resolve as relative; social previews break | Crawlability & Indexation | Critical | High | −25 |
| 2 | No `app/sitemap.ts` → search engines must guess URLs | Crawlability & Indexation | Critical | High | −20 |
| 3 | No `app/robots.ts` → no sitemap pointer, no crawl directives | Crawlability & Indexation | High | High | −10 |
| 4 | No explicit `alternates.canonical` per locale → hreflang weakened | Crawlability & Indexation | High | High | −10 |
| 5 | Home page has **no `<h1>`** ("Ciao, I'm Sonny" lives inside `<VideoText>` with default `as="div"`) | On-Page | Critical | High | −20 |
| 6 | No `<header>`, `<footer>`, `<nav>` landmarks → poor a11y/semantic signal | On-Page | Medium | High | −5 |
| 7 | No favicon set; no `app/icon.tsx`, `apple-icon.tsx`, or `manifest.ts` | Technical Foundations | High | High | −10 |
| 8 | No JSON-LD (`Person`, `WebSite`, `ProfilePage`) → invisible to AI Overviews / answer engines | Content & E-E-A-T | High | High | −12 |
| 9 | No OG/Twitter images → blank link previews on LinkedIn, X, iMessage | On-Page | High | High | −8 |
| 10 | `next.config.ts` has no `images` config (no AVIF/WebP formats forced) | Technical Foundations | Medium | Medium | −5 |
| 11 | No verification meta (Google Search Console etc.) — placeholder OK | Authority & Trust | Low | High | −2 |
| 12 | `VideoText` (hero headline) sizes via plain `vw` units → reads weirdly on mobile (user already worked around with `fontSize={10}`) | On-Page (UX-adjacent) | Low | High | −2 |

Estimated current Health Index: **~52 (Poor)**.
Estimated post-change Health Index: **~85 (Good)**.

### Stack version drift (separate from SEO, but in scope per user request)

`AGENTS.md` claims versions that no longer match `package.json`. Full delta:
Next.js (16.2.2 → 16.2.3), React (19.2.4 → 19.2.5), TypeScript (`6` → `^6.0.2`),
`@base-ui/react` (1.3.0 → ^1.4.0), `@biomejs/biome` (2.4.10 → ^2.4.11),
`vitest` (4.1.2 → ^4.1.4), `lucide-react` (1.7.0 → ^1.8.0),
`shadcn` (4.1.2 → ^4.3.0), `tailwindcss` / `@tailwindcss/postcss` (4 → ^4.2.2),
`@wrksz/themes` (0.7.9 → ^0.8.3), `next-intl` (4.9.0 → ^4.9.1).
`CLAUDE.md` "Recent Changes" is stale and duplicates `AGENTS.md`.

---

## Out of Scope (defer, tracked elsewhere)

- **CSP nonce migration** — tracked in memory `project_security_posture.md`.
  The current `script-src 'self' 'unsafe-inline'` permits inline JSON-LD as-is.
  When the nonce work happens, the JSON-LD `<script>` tags will need a nonce.
- **Blog/MDX content layer** — not present, not needed for portfolio ranking.
- **Analytics changes** — `@vercel/analytics` + `@vercel/speed-insights`
  already wired in `app/[locale]/layout.tsx`.
- **Backlink / off-site authority work** — handled by humans.
- **Programmatic SEO / pSEO** — not applicable to a one-pager portfolio.

---

## Implementation

### 1. Centralize site config

**Create** `lib/site-config.ts`: single source of truth for URL, name,
locales, social handles. All SEO files import from here.

```ts
import { locales, defaultLocale } from "@/lib/i18n";

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonnymonti.com",
  name: "Sonny Monti",
  locales,
  defaultLocale,
  // No Twitter/X account — intentional. Do not add a twitter handle here.
  github: "https://github.com/Snie",
  linkedin: "https://www.linkedin.com/in/sonnymonti/",
  email: "montis@acm.org",
  // Brand accent — green. Matches the dark-mode hero video.
  accent: "#22c55e", // tweakable; verify against the actual --primary token
} as const;
```

### 2. Foundations — `metadataBase`, canonical, robots, icons

**Modify** `app/[locale]/layout.tsx` `generateMetadata`:

- Add `metadataBase: new URL(SITE.url)`.
- Add `alternates.canonical: \`/${locale}\`` (self-referencing per locale).
- Keep existing `alternates.languages`, add `"x-default": "/en"`.
- Add `robots: { index: true, follow: true, googleBot: { ... } }`.
- Add `icons: { icon: "/icon", apple: "/apple-icon" }` (Next auto-resolves to
  the route handlers in §6).
- Add `manifest: "/manifest.webmanifest"`.
- Add `verification: { google: process.env.GOOGLE_SITE_VERIFICATION }` —
  no-op until the env var is set, harmless when unset.
- Add `title` template form: `{ default: "...", template: "%s — Sonny Monti" }`.
- Move `themeColor` into a new `export const viewport: Viewport = { themeColor: SITE.accent }`
  (Next 16 split — `themeColor` no longer belongs in `metadata`).
- Set Twitter card → `summary_large_image`. **Do not** set `twitter.creator`
  (no account).

### 3. `app/sitemap.ts` (locale-aware)

**Create** root-level `app/sitemap.ts` returning `MetadataRoute.Sitemap`.
Iterate `SITE.locales` and emit one entry per locale with:

- `url: \`${SITE.url}/${locale}\``
- `lastModified: new Date()`
- `changeFrequency: "monthly"`
- `priority: 1.0` for default locale, `0.9` for the rest
- Per-entry `alternates.languages` mapping every locale to its URL
  (Next 16's `MetadataRoute.Sitemap` accepts this)

### 4. `app/robots.ts`

**Create** root-level `app/robots.ts`:

- `userAgent: "*"`, allow `/`, disallow `/api`, `/_next`.
- `sitemap: \`${SITE.url}/sitemap.xml\``.
- `host: SITE.url`.

### 5. `app/manifest.ts`

**Create** root-level `app/manifest.ts` returning `MetadataRoute.Manifest`:

- `name: "Sonny Monti"`, `short_name: "Sonny"`, `start_url: "/en"`,
  `display: "standalone"`.
- `background_color`/`theme_color` = `SITE.accent` (green).
- `icons`: 192 + 512 entries pointing at `/icon` (Next will resize).

### 6. Favicon — code-generated monogram in **green**

**Create** `app/icon.tsx`:

- Export `size = { width: 32, height: 32 }`, `contentType = "image/png"`.
- Render `ImageResponse` with "SM" monogram, white text on `SITE.accent` (green)
  background. Bold, centered, no padding.

**Create** `app/apple-icon.tsx`:

- Export `size = { width: 180, height: 180 }`, `contentType = "image/png"`.
- Same monogram, slightly larger glyph; iOS auto-rounds the corners.

This avoids committing 8 PNG variants and keeps the icon in lockstep with
the brand. If the user later wants a hand-designed icon, dropping a
`favicon.ico` in `app/` overrides the route automatically.

### 7. Open Graph & Twitter images (dynamic per-locale)

**Create** `app/[locale]/opengraph-image.tsx`:

- Export `size = { width: 1200, height: 630 }`, `contentType = "image/png"`.
- Export `generateImageMetadata` returning one entry per locale (alt text
  per language).
- Render `ImageResponse` with: name, role ("ML Tech Lead at Swiss Post"),
  locale-flavored tagline, **green accent gradient**, subtle hex-grid pattern
  evoking the hero. Read tagline from `messages/<locale>.json` →
  `seo.ogTagline` so copy ownership stays in `next-intl`.

**Create** `app/[locale]/twitter-image.tsx`: re-export from `opengraph-image.tsx`
(Twitter card upgrades to `summary_large_image`).

Wire `metadata.openGraph.images` + `metadata.twitter.images` in
`app/[locale]/layout.tsx` to point at the route. With `metadataBase` set,
relative URLs resolve to absolute automatically.

### 8. JSON-LD structured data

**Create** `lib/seo/jsonld.ts` with three pure builders:

- `personSchema(locale)` — `@type: "Person"`, `name`, `url`, `image` (the
  hero portrait absolute URL), `sameAs: [SITE.github, SITE.linkedin]`
  (no Twitter), `jobTitle`, `worksFor: { "@type": "Organization", name: "Swiss Post" }`,
  `knowsAbout: ["Machine Learning", "MLOps", "Solution Architecture", ...]`,
  `description` (translated).
- `websiteSchema(locale)` — `@type: "WebSite"`, `url`, `name`, `inLanguage`.
  Omit `potentialAction.SearchAction` (no on-site search).
- `profilePageSchema(locale)` — `@type: "ProfilePage"`,
  `mainEntity: personSchema(locale)`, `dateCreated`, `dateModified`.

**Modify** `app/[locale]/layout.tsx`: render one combined `@graph` JSON-LD
block (`Person` + `WebSite`) inside `<body>` near the top:

```tsx
<script
  type="application/ld+json"
  // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [personSchema(locale), websiteSchema(locale)],
    }),
  }}
/>
```

**Modify** `app/[locale]/page.tsx`: render `profilePageSchema(locale)` as a
second JSON-LD block scoped to the home page.

### 9. On-page semantic fixes

**Modify** `components/hero-section.tsx` line 55: pass `as="h1"` to
`<VideoText>`. The component already supports the `as` prop (defaults to
`"div"`) and already renders an `<span class="sr-only">` mirror of the
content for SEO/a11y — so this is a one-prop change. Visual output unchanged.

```tsx
<VideoText key={resolvedTheme} src={videoSrc} as="h1" fontSize={…}>
  {t("title")}
</VideoText>
```

**Modify** `app/[locale]/layout.tsx`:

- Wrap the fixed top-right controls cluster in `<header>` with
  `aria-label="Site controls"`.
- Wrap the language/theme switcher inside `<nav aria-label="Site navigation">`.
- Add a `<footer>` at the bottom of `<body>` with: copyright + name, link to
  GitHub, link to LinkedIn, link to email, "Built with Next.js" line. Use
  the existing translation keys; add a `footer` namespace if needed.

### 10. VideoText responsive sizing — joint visual inspection required

**Discovery, not auto-fix.** The user has flagged that
`fontSize={10}` (interpreted as `10vw` by the local component — see
`components/ui/video-text.tsx:105`) feels off on mobile. The local component
diverges from the upstream MagicUI default (`"120"` as a unitless string —
see <https://magicui.design/docs/components/video-text>); the upstream API
does not prescribe a responsive strategy.

What we already know about the component:

- `fontSize: number` → wrapped to `${fontSize}vw` (line 105).
- `fontSize: string` → used **as-is** in the SVG `text` `font-size` attribute.
  This means we can pass any CSS `<length>` expression — including `clamp()` —
  as a string and the component will honor it.

Proposed change in `components/hero-section.tsx`:

```tsx
<VideoText
  key={resolvedTheme}
  src={videoSrc}
  as="h1"
  fontSize="clamp(2.5rem, 11vw, 9rem)"
>
  {t("title")}
</VideoText>
```

**Do not commit final values yet.** Ship this PR with a placeholder clamp,
then in a follow-up `bun dev` session iterate together at 375 / 768 / 1280 /
1920 px breakpoints (per memory `feedback_visual_inspection.md`). The clamp
keeps a single tunable expression so iteration is one-line edits.

Also worth checking during inspection: the hero container is `h-50 w-full`
(200 px tall) — at very small viewports the SVG's `<text x="50%" y="50%">`
positioning may visually clip if the font-size grows past container height.
A `lineHeight=0.9` or container `min-h` adjustment may be needed.

### 11. `next.config.ts` polish

**Modify** `next.config.ts`:

- Add `images: { formats: ["image/avif", "image/webp"], remotePatterns: [] }`
  even with no remote images — declaring formats nudges Next to serve AVIF first.
- **Do not** add static-asset cache headers; Vercel sets aggressive
  immutable caching for `/_next/static/` by default. Verify in the deployed
  response headers if needed.
- **No CSP change** in this PR (see Out of Scope).

### 12. Translation keys

**Modify** `messages/{en,de,fr,it}.json`: add a `seo` namespace:

- `seo.ogTagline` — short marketing line for the OG image (≤ 60 chars per
  locale).
- `seo.metaDescription` — promote the existing inline `descriptions` map out
  of `app/[locale]/layout.tsx` so locale ownership lives in `next-intl`.
- `seo.metaTitle` — same for titles (currently identical across locales —
  fine to keep that way unless the user wants per-locale flavor).

Refactor `generateMetadata` to read from `getTranslations({ locale, namespace: "seo" })`.

### 13. Documentation sync (`readme-agents-sync` checklist)

**Modify** `AGENTS.md`:

- Update Tech Stack pins to match `package.json` (see version drift list above).
  Drop the brittle "Bun 1.3.11" note and replace with: "Bun (latest, see
  `bun upgrade` in the cadence table)."
- Add a new short section `## SEO` documenting the conventions:
  - site URL via `lib/site-config.ts`
  - JSON-LD via `lib/seo/jsonld.ts`
  - dynamic OG via `app/[locale]/opengraph-image.tsx`
  - sitemap/robots/manifest via `app/{sitemap,robots,manifest}.ts`
  - favicons via `app/{icon,apple-icon}.tsx`
- Extend the Repository Structure tree with the new files.

**Modify** `README.md`:

- First paragraph: add one human-voice line naming the stack ("Built with
  Next.js 16, React 19, Tailwind v4, and next-intl").
- Pointer to `AGENTS.md` already exists at multiple lines — no change.
- Do **not** add SEO conventions here (that's `AGENTS.md` territory).

**Modify** `CLAUDE.md`:

- Delete the stale `## Recent Changes` block — contradicts `package.json`
  and duplicates `AGENTS.md`.
- Replace `## Active Technologies` with: "See `AGENTS.md` for the
  authoritative tech stack." `@AGENTS.md` import already pulls everything.

Run `markdownlint-cli2 README.md AGENTS.md CLAUDE.md` and fix any violations.

---

## Critical Files

**Create:**

- `lib/site-config.ts`
- `lib/seo/jsonld.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/manifest.ts`
- `app/icon.tsx`
- `app/apple-icon.tsx`
- `app/[locale]/opengraph-image.tsx`
- `app/[locale]/twitter-image.tsx`

**Modify:**

- `app/[locale]/layout.tsx` — `metadataBase`, canonical, robots, icons,
  manifest, `viewport.themeColor`, JSON-LD scripts, semantic
  `<header>/<footer>/<nav>`, title template, OG images, twitter card upgrade
- `app/[locale]/page.tsx` — `ProfilePage` JSON-LD
- `components/hero-section.tsx` line 55 — `as="h1"`, `fontSize="clamp(...)"`
- `next.config.ts` — `images.formats` (AVIF/WebP)
- `messages/{en,de,fr,it}.json` — `seo.*` namespace
- `AGENTS.md` — version pins, SEO section, repo tree
- `README.md` — stack mention
- `CLAUDE.md` — drop stale "Recent Changes" / "Active Technologies"

**Reference (do not modify):**

- `lib/i18n.ts` — locale list source of truth (re-exported via `lib/site-config.ts`)
- `proxy.ts` — middleware, leave alone
- `components/ui/video-text.tsx` — local API confirmed (line 105 transforms
  numeric → `vw`, string passes through unchanged)

---

## Subagent Delegation (per `feedback_subagent_execution`)

Opus orchestrates, Sonnet does the edits.

| Phase | Agent | Scope |
|---|---|---|
| A | `frontend` | §1 site-config + §2 layout metadata foundations + §11 next.config |
| B | `frontend` | §3 sitemap + §4 robots + §5 manifest + §6 icon/apple-icon (small, one prompt) |
| C | `frontend` | §7 OG/Twitter images + §12 translation keys + `generateMetadata` refactor |
| D | `frontend` | §8 JSON-LD builders + injection in layout + page |
| E | `frontend` | §9 semantic h1/header/footer/nav + §10 VideoText clamp (placeholder values) |
| F | orchestrator (Opus) | §13 doc sync — `AGENTS.md`, `README.md`, `CLAUDE.md` (Opus's lane per project convention) |
| G | `tester` | run `bun run test`; fix only test files if the `<h1>` change breaks `components/__tests__/hero-section.test.tsx` |
| H | `reviewer` | final pass against the `seo-audit` framework checklist |

Phases A → E are sequential (each builds on the previous). Within a phase the
agent gets one self-contained brief with file paths, line numbers, and exact
change descriptions — no "based on findings" hand-waving (per
`feedback_subagent_execution`).

---

## Verification

End-to-end checks before opening the PR:

1. **Build:** `bun run build` — must succeed; build output should mention
   the new sitemap/robots/manifest/icon/opengraph-image routes.
2. **Lint:** `bun run lint` (Biome).
3. **Tests:** `bun run test` (Vitest) — fix any breakage from the `<h1>` swap.
4. **E2E smoke:** `bun run test:e2e` (Playwright).
5. **Bundle check:** `ANALYZE=true bun run build` — confirm no client-JS
   regression (ImageResponse + JSON-LD are server-only and add zero client JS).
6. **Local dev verification** (`bun dev`):
   - `http://localhost:3000/sitemap.xml` — 4 URLs, all locales, hreflang
     alternates per entry.
   - `http://localhost:3000/robots.txt` — sitemap URL present, host set.
   - `http://localhost:3000/manifest.webmanifest` — valid JSON.
   - `http://localhost:3000/icon`, `/apple-icon` — render PNG (green monogram).
   - `http://localhost:3000/en/opengraph-image` (and `/de`, `/fr`, `/it`) —
     render 1200×630 PNG with localized tagline.
   - View source on `/en` — confirm: single `<h1>` (semantic), two JSON-LD
     `<script>` blocks (root `WebSite`+`Person`, page `ProfilePage`),
     absolute canonical, hreflang for all 4 locales + `x-default`.
7. **External validators (after Vercel deploy preview):**
   - Google Rich Results test on `https://sonnymonti.com` (or preview URL).
   - LinkedIn Post Inspector on each locale URL.
   - Lighthouse SEO category — target ≥ 95.
   - Re-run the `seo-audit` skill against the deployed preview URL —
     target Health Index ≥ 80 (Good).
8. **`readme-agents-sync` skill:** re-run after doc edits — target all 5
   checklist items pass.
9. **VideoText follow-up session** (separate from this PR or final commit):
   joint `bun dev` visual inspection at 375 / 768 / 1280 / 1920 px to lock
   the `clamp()` values per `feedback_visual_inspection.md`.

---

## Resume Note

If a future session is asked to "resume the SEO work":

1. Read `specs/004-seo-optimizations/plan.md` (this file).
2. Run `git status` and check which `app/` and `lib/` files exist — work picks
   up at the first phase (A → E) whose files are still missing.
3. Re-run the `seo-audit` skill against the current state to refresh the
   Health Index estimate before continuing.
4. The VideoText `clamp()` values are intentionally left as a placeholder
   pending visual inspection — do not finalize them without the user.

---

## Open Items Needing Owner Confirmation Before Coding

- Whether to set `GOOGLE_SITE_VERIFICATION` env var now or in a follow-up.
  The metadata key is harmless when env is unset.
- Exact green hex for `SITE.accent` — current placeholder `#22c55e`. Verify
  against the `--primary` token in the `@wrksz/themes` config or pull from
  the dark-mode hero video's dominant color.
- Confirm the `knowsAbout` list for `Person` JSON-LD (current proposal:
  Machine Learning, MLOps, Solution Architecture — extend with anything
  user wants surfaced to AI Overviews).
