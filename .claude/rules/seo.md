---
paths:
  - "app/**"
  - "lib/seo/**"
  - "lib/site-config.ts"
  - "messages/**"
---

# SEO

Loaded automatically when working with SEO surfaces. The site URL, social handles, and brand
accent live in `lib/site-config.ts` (`SITE`). Every SEO surface imports from there — never
hardcode `https://sonnymonti.com` or social URLs in components or pages.

| Concern | File |
| --- | --- |
| Site config (URL, name, social, accent) | `lib/site-config.ts` |
| JSON-LD builders (Person, WebSite, ProfilePage) | `lib/seo/jsonld.ts` |
| Per-locale metadata (title, description, OG, hreflang, canonical, robots) | `app/[locale]/layout.tsx` (`generateMetadata` + `viewport`) |
| Translated title/description/og-tagline | `messages/<locale>.json` → `seo.*` namespace |
| Sitemap (`/sitemap.xml`) | `app/sitemap.ts` |
| Robots (`/robots.txt`) | `app/robots.ts` |
| PWA manifest (`/manifest.webmanifest`) | `app/manifest.ts` |
| Favicons (`/icon`, `/apple-icon`) | `app/icon.tsx`, `app/apple-icon.tsx` |
| Open Graph / Twitter images | `app/[locale]/opengraph-image.tsx`, `app/[locale]/twitter-image.tsx` |

## Conventions

- All metadata flows through `next-intl` translations — no hardcoded copy in `generateMetadata`.
- JSON-LD uses `@id` references inside `@graph` to dedupe shared nodes (e.g. `ProfilePage.mainEntity`
  references `Person` by `@id` instead of duplicating the object).
- Production URL override at build time: `NEXT_PUBLIC_SITE_URL`.
- Google Search Console verification: `GOOGLE_SITE_VERIFICATION` (no-op when unset).
- Favicons are code-generated via `ImageResponse` — do not commit binary `favicon.ico` / PNG icon
  files unless overriding the route on purpose.
- When adding a new public route, add it to `app/sitemap.ts` and ensure the layout's
  `alternates.languages` covers all locales.
- Use the `seo-audit` skill against the deployed preview before merging SEO-relevant changes;
  target Health Index ≥ 80 (Good).
