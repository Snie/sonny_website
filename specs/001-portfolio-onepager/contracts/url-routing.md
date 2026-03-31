# URL Routing Contract

This page exposes URLs to visitors and search engines. The routing contract
defines what URLs exist and how they behave.

## Routes

| URL Pattern | Behaviour |
| --- | --- |
| `/` | Redirect to `/{detected-locale}` based on `Accept-Language` header. Fallback: `/en`. |
| `/en` | English version of the portfolio page. |
| `/it` | Italian version of the portfolio page. |
| `/de` | German version of the portfolio page. |
| `/fr` | French version of the portfolio page. |
| `/{unsupported}` | Next.js 404 (no custom 404 in v1). |

## Locale Detection (Middleware)

1. Read `Accept-Language` header.
2. Match against supported locales: `["en", "it", "de", "fr"]`.
3. Redirect (302) to `/{best-match}`.
4. If no match → redirect to `/en`.

## Response

All locale routes return a single HTML page (SSG) with all sections rendered.
No API endpoints. No JSON responses. No client-side data fetching.
