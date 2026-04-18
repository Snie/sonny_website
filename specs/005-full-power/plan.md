# Perf 2026 — LCP, Bundle, Legacy Polyfills (`feat/fullpower`)

> Canonical plan persisted to: **`specs/005-full-power/plan.md`** in the repo
> (following `001-portfolio-onepager`, `002-unit-test-suite`,
> `003-perf-optimization`, `004-seo-optimizations`). Step 0 of implementation
> copies this file there.

## Context

Real-world Lighthouse on `sonnymonti.com` (post-SEO) is green
(Perf 97, A11y 96, BP 100, SEO 100). The **Insights** panel still flags
concrete remediations that we can fix without touching the 2.3 MB hero
video (acknowledged heavy):

| Insight | Est. saving | Root cause (verified via Explore + Context7) |
| --- | ---: | --- |
| LCP image missing `fetchpriority=high` | — | `components/hero-section.tsx:114` uses `loading="eager"` but no priority hint; next/image's `priority` prop sets both + injects `<link rel=preload as=image>`. |
| Legacy JS polyfills shipped | 14 KiB | No `browserslist` in `package.json` → SWC ships Array.at/flat/flatMap, Object.fromEntries/hasOwn, String.trimStart/trimEnd even though all are ES2022 baseline. |
| `domAnimation` in main bundle | ~30–40 KiB | `app/[locale]/layout.tsx:4` imports `domAnimation` **statically**, defeating `LazyMotion`. Framer docs prescribe `features={() => import(...)}` for code-splitting. |
| Video eager-downloads 2.3 MB | up to ~2 MB deferred | `components/ui/video-text.tsx:87` default `preload="auto"`. `preload="metadata"` still autoplays muted loop but defers the payload. |
| Canvas background competes with LCP paint | — | `components/hex-grid-background.tsx:400` starts `animate()` immediately on mount. Defer via `requestIdleCallback`. |

Target: flip all five Insights rows to pass/info, keep Lighthouse ≥ 97 Perf
/ ≥ 95 A11y, cut initial JS by ~50–80 KiB.

## Goals / non-goals

- **Goals**: `fetchpriority=high` on the portrait, drop baseline polyfills,
  move framer-motion off the critical path, stop the video from clogging
  initial bandwidth, give LCP breathing room before the canvas animation
  loop starts. No UX regression.
- **Non-goals**: re-encoding the video, rewriting `HexGridBackground`, CSP
  nonce migration (separate track), below-fold sections (already lazy via
  `next/dynamic`), Vercel-script preconnects (Lighthouse explicitly said
  "no additional origins are good candidates").

## What ships

### 1. LCP image — `priority` prop
**File:** `components/hero-section.tsx:112-122`

```diff
 <Image
 	alt="Sonny"
-	loading="eager"
+	priority
 	src={sonny}
 	sizes="(max-width: 400px) 50vw, (max-width: 1000px) 40vw, 25vw"
 	style={{ width: "100%", height: "auto" }}
 />
```

Next.js 16.2 `priority` sets `loading=eager` + `fetchpriority=high` and
injects `<link rel=preload as=image>` into `<head>`. Directly resolves the
Insights "fetchpriority=high should be applied" item.

### 2. Drop legacy polyfills — explicit browserslist
**File:** `package.json` (root, new top-level key)

```json
{
	"name": "sonny_website",
	…
	"browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"]
}
```

This is the exact baseline Next.js 16 documents for "modern browsers with
zero configuration" (Context7, `/vercel/next.js/v16.2.2`). Making it explicit
tells SWC to stop transpiling ES2022-baseline features. Drops the
`core-js/modules/…` transforms Lighthouse flagged.

### 3. Dynamic LazyMotion features
**New file:** `lib/motion-features.ts`

```ts
export { domAnimation as default } from "framer-motion";
```

**File:** `app/[locale]/layout.tsx:4,123`

```diff
-import { domAnimation, LazyMotion } from "framer-motion";
+import { LazyMotion } from "framer-motion";

 …

-<LazyMotion features={domAnimation} strict>
+<LazyMotion features={() => import("@/lib/motion-features").then((m) => m.default)} strict>
```

Matches Framer Motion's async-features snippet (Context7 `/grx7/framer-motion`).
Splits `domAnimation` into its own async chunk loaded after hydration.
`strict` stays on — Phase 1 exploration confirmed every animated component
already uses the lazy `m` alias (`hero-section.tsx:4`, `elsewhere-section.tsx:3`,
`skills-section.tsx:3`, `timeline.tsx:3`), so no regression risk.

### 4. Defer the video payload
**File:** `components/hero-section.tsx:56`

```diff
-<VideoText key={resolvedTheme} src={videoSrc} as="h1" fontSize="clamp(2.5rem, 11vw, 9rem)">
+<VideoText
+	key={resolvedTheme}
+	src={videoSrc}
+	as="h1"
+	fontSize="clamp(2.5rem, 11vw, 9rem)"
+	preload="metadata"
+>
```

`VideoText` already accepts `preload` (`"auto" | "metadata" | "none"`,
`components/ui/video-text.tsx:31`). `metadata` downloads container/codec info
only; the autoplay-muted-loop starts streaming once enough buffer arrives.
The text mask is SVG-derived (not video-derived), so the title is visible
the moment the mask renders.

### 5. Defer the canvas animation loop
**File:** `components/hex-grid-background.tsx:400`

```diff
-animate();
+const start = () =>
+	typeof window.requestIdleCallback === "function"
+		? window.requestIdleCallback(animate, { timeout: 500 })
+		: window.setTimeout(animate, 0);
+start();
```

`buildGrid()` still runs synchronously so the first static hex frame paints
with the page. Only the `requestAnimationFrame` loop waits for idle. On
Safari (no `requestIdleCallback`), `setTimeout(…, 0)` yields one macrotask —
still enough to clear the LCP paint.

## Verification

Single batched run (per memory `feedback_lint_at_end.md`):

```bash
bun run lint
bun run build            # expect: 12 static routes, no new warnings
bun run test
bun run test:e2e
```

Then a one-shot bundle analysis to prove the polyfill + framer chunks moved:

```bash
ANALYZE=true bun run build
open .next/analyze/client.html
# Expect: no `core-js/modules/es.array.at` etc; framer-motion in its own chunk.
```

If the 140 KiB chunk Lighthouse named is still dominant, pull the top 3
modules from the analyzer and iterate from data — no guessing.

Deploy preview, then manually:

1. Lighthouse → Insights: the 5 rows in the table above flip to pass/info.
2. DevTools → Network: portrait `webp` shows `Priority: High`, no
   `core-js/modules/*` chunks, video `Content-Length` only appears after
   `play()` (preload=metadata working).
3. Smoke-test theme toggle (green/blue video swap) and language switcher —
   no animation regression from the async LazyMotion load.

## Subagent execution

Per memory `feedback_subagent_execution.md` (Opus orchestrates, Sonnet edits)
and `feedback_lint_at_end.md` (no per-phase lint/build).

| Phase | Who | Tasks |
| --- | --- | --- |
| 0 | Opus | Branch `feat/fullpower` already exists off `dev`; copy this plan to `specs/005-full-power/plan.md` |
| 1 | `frontend` (Sonnet) | Fixes #1, #3 (new `lib/motion-features.ts` + layout edit), #4, #5 in one call |
| 2 | Opus | `package.json` browserslist (#2) |
| 3 | Opus | Batched `bun run lint && bun run build && bun run test && bun run test:e2e` |
| 4 | Opus | `ANALYZE=true bun run build` → skim `client.html`, capture top chunks |
| 5 | `reviewer` (Sonnet) | Read diff, confirm no `motion.X` regression, sanity-check before/after |
| 6 | Opus | Commit `perf(web): …` → semantic-release emits a patch with a "Performance Improvements" CHANGELOG entry |

Phase 1 edits are in independent files, so the `frontend` agent does them
in one multi-file call.

## Out of scope (tracked, not shipped here)

- Video re-encoding / lower-bitrate variant (user flagged as hard to
  optimize further).
- CSP nonce migration (memory `project_security_posture.md`).
- `HexGridBackground` refactor to `OffscreenCanvas` / Web Worker.
- Hardcoded GitHub/LinkedIn/email URLs in `components/hero-section.tsx:72,82,92`
  should use `SITE.*` — reviewer note from `feat/seo`, low priority.
- VideoText `fontSize` clamp joint visual inspection (still pending from
  `feat/seo`, memory `feedback_visual_inspection.md`).

## Commit

Single commit, conventional:

```
perf(web): prioritize LCP, split framer-motion, drop legacy polyfills

- next/image `priority` on portrait (adds fetchpriority=high + preload)
- LazyMotion async features via dynamic import
- browserslist pinned to Next 16 modern baseline (drops ~14 KiB polyfills)
- VideoText preload=metadata (defers 2.3 MB hero video)
- HexGridBackground animate() deferred to requestIdleCallback
```

`perf:` triggers a patch bump via semantic-release and lands under
"Performance Improvements" in `CHANGELOG.md`.
