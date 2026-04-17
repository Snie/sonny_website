# Perf Audit of `feat/hexfix` + Release Commit

## Context

Branch `feat/hexfix` (vs `feat/initial_setup`) carries a batch of performance
work done by Claude 4.6 alongside the existing hex-grid fix. The user wants:

1. A second-pass review of those changes against
   `~/.claude/skills/nextjs-best-practices/SKILL.md` and
   `~/.claude/skills/react-best-practices/` (45-rule Vercel guide).
2. A clean conventional-commit message that semantic-release can pick up to
   produce a meaningful CHANGELOG entry.
3. The plan persisted to `specs/003-perf-optimization/plan.md` so we can
   resume in a separate session if context runs out.

No new feature work — this is review + small follow-ups + a commit.

## Files Touched on the Branch (12)

- `app/[locale]/layout.tsx` — Noto Sans subset (4→2 weights, `display: swap`),
  `<LazyMotion features={domAnimation} strict>` wrapper.
- `app/[locale]/page.tsx` — `next/dynamic` for 8 below-fold sections,
  `generateStaticParams` for all locales.
- `next.config.ts` — `@next/bundle-analyzer` plugin (gated by `ANALYZE=true`).
- `components/hex-grid-background.tsx` — see audit §3.
- `components/{hero,skills,timeline,elsewhere}-section.tsx` — `motion.*` → `m.*`.
- `test/mocks/framer-motion.tsx` — adds `LazyMotion`/`domAnimation`/`m` exports.
- `package.json` + `bun.lock` — pinned versions (no more floating `"latest"`).
- `.gitignore` — excludes `docs/resume`, `.claude/worktrees`.

## Audit Verdict

### What 4.6 got right (keep as-is)

| Change | Skill rule | Verdict |
|--------|-----------|---------|
| Noto Sans weights 400/600 + `display:swap` | nextjs §5 / `bundle-*` | Halves font payload, removes FOIT. Good. |
| `LazyMotion + m` (strict) in layout | `bundle-dynamic-imports` | Drops ~25 kB from main framer-motion bundle. All call sites migrated (verified: `grep "from \"framer-motion\""` shows only `m`/`LazyMotion`/`useInView`, zero `motion.*` left). |
| `next/dynamic` for sections (`about`/`skills`/`timeline`/`education`/`academic`/`languages`/`elsewhere`/`author-note`) | `bundle-dynamic-imports` | HeroSection stays static (above-fold). Splits client JS into smaller chunks → faster hydration. |
| `generateStaticParams` over `locales` | nextjs §3 / §6 | Pre-renders all 4 locales at build → fully static delivery. |
| Hex-grid: cheap `globalAlpha+arc` instead of per-frame `createRadialGradient` | `js-cache-*` family | Big main-thread win — `createRadialGradient` is one of canvas's slowest paths. |
| Hex-grid: `prefersReducedMotion`/mobile gating for trail length & maxLights | `client-event-listeners` (spirit) | Cuts CPU on mobile + a11y. |
| Hex-grid: early-exit on `alpha < 0.05` trail dots | `js-early-exit` | Skips no-op draws cheaply. |
| `@next/bundle-analyzer` (gated) | nextjs §5 | Enables future regression tracking via `ANALYZE=true bun build`. |
| Pinned versions in `package.json` | (project hygiene) | Removes Dependabot/`bun add latest` drift. |
| Test mock updated with `m`, `LazyMotion`, `domAnimation` | (test infra) | Vitest suite still passes the mock surface 4.6 introduced. |

### Minor gaps — not blockers, recommend follow-up

1. **`optimizePackageImports` missing.** The Vercel `bundle-barrel-imports`
   rule is the cheapest big win we still haven't taken. Adding to
   `next.config.ts`:

   ```ts
   experimental: {
     optimizePackageImports: [
       "lucide-react",
       "react-icons",
       "framer-motion",
       "@base-ui/react",
     ],
   },
   ```

   Cuts dev boot 15-70 % and trims cold-start ~40 % per Vercel's writeup.
   Safe — Next.js auto-rewrites barrel imports at build time.

2. **`@vercel/analytics` + `@vercel/speed-insights` imported eagerly.** The
   `bundle-defer-third-party` rule recommends `next/dynamic`. Vercel's
   `/next` entry-points already self-defer (script tag with `data-priority`),
   so this is *acceptable*. Verify with `ANALYZE=true bun build` before
   touching.

3. **HexGrid keeps animating off-screen.** Once the user scrolls past the
   hero, the `requestAnimationFrame` loop still runs. An
   `IntersectionObserver` (or `document.visibilityState`) gate would let it
   sleep. Out of scope for this commit, log as a follow-up.

4. **Dynamic-loaded sections render on first paint** — they all live on the
   same screen and there's no `loading.tsx` or `<Suspense fallback>`. The JS
   still has to download before they hydrate, so the win here is reduced
   parse cost & better caching, not LCP. That's fine; just don't oversell it
   in the commit body.

### No regressions found

- `motion.*` is gone from all `*.tsx` (verified via grep).
- `LazyMotion ... strict` will throw at runtime if any `motion.*` slipped
  through — none did.
- Hex-grid's `let maxLights` reassignment is intentional (recomputed in
  `buildGrid` on resize); no closure leak.

## Plan of Action (post-approval)

**Execution model:** the orchestrator (Opus 4.7) only reads results,
makes the commit, and signs off. All file edits are delegated to the
project's Sonnet-powered subagents (`frontend`, `tester`, `reviewer`
per `AGENTS.md`) to conserve tokens. Each agent gets a self-contained
prompt with file paths, line numbers, and exact change description —
no "based on findings" hand-waving.

### Step 1 — Persist this plan to the spec folder (orchestrator)

Orchestrator copies this plan into `specs/003-perf-optimization/plan.md`
(create the directory). Cheap — single file write, no need to delegate.

### Step 2 — Apply `optimizePackageImports` (→ `frontend` subagent)

Dispatch one `frontend` agent with this brief:

> Edit `next.config.ts`. The current `nextConfig` object has only a
> `headers()` method. Add `experimental.optimizePackageImports` with the
> array `["lucide-react", "react-icons", "framer-motion",
> "@base-ui/react"]`. Then run `bun run lint && bun run build` and
> report the build's "First Load JS" line for `/[locale]`. Do not touch
> any other file.

### Step 3 — Smoke-check with bundle analyzer (→ `frontend` subagent)

Dispatch one `frontend` agent:

> Run `ANALYZE=true bun run build`. Open `.next/analyze/client.html`
> mentally — read the file, find the largest chunks, and report:
> (1) is framer-motion in a lazy chunk separate from the main route
> bundle? (2) does each next/dynamic section have its own chunk?
> (3) any chunk > 150 kB gzipped? Reply with the answers and the top
> 5 chunks by size. Do not modify any file.

### Step 4 — Document bundle analyzer in AGENTS.md (→ `frontend` subagent)

Dispatch one `frontend` agent with this brief:

> Add a "Bundle Analysis" subsection to `AGENTS.md`, placed as a sibling
> of the Testing section (right after it). Use the markdown block below
> verbatim. Then run `markdownlint-cli2 AGENTS.md` and fix any
> violations it reports. Do not edit other files.

Block to insert:

```markdown
### Bundle Analysis

`@next/bundle-analyzer` is wired into `next.config.ts` behind the
`ANALYZE` env flag. Use it when changing dependencies, adding heavy
components, or investigating a regression in initial JS payload.

```bash
ANALYZE=true bun run build
```

The build emits three HTML reports under `.next/analyze/`:

- `client.html` — what ships to the browser (the one you usually want)
- `nodejs.html` — server-side bundle
- `edge.html` — edge runtime bundle (empty for this project)

What to look for:

- framer-motion should sit in a lazy chunk (loaded via `LazyMotion`),
  not in the main route bundle.
- Below-fold sections wrapped in `next/dynamic` should each have their
  own chunk.
- Any single chunk above ~150 kB gzipped is worth investigating.

The reports are git-ignored; do not commit them.
```

### Step 5 — Run the test suite (→ `tester` subagent)

Dispatch one `tester` agent:

> Run `bun run test` (Vitest). All suites must pass. The framer-motion
> mock at `test/mocks/framer-motion.tsx` already exposes `m`,
> `LazyMotion`, and `domAnimation`, so motion-using components should
> render fine. If any suite fails, diagnose and fix in test files only
> (do not modify production components). Report pass/fail and any fixes.

### Step 6 — Code review pass (→ `reviewer` subagent)

Dispatch one `reviewer` agent:

> Review the diff on branch `feat/hexfix` vs `feat/initial_setup`. Focus
> on three things: (1) are there any remaining `motion.*` usages that
> would crash under `<LazyMotion strict>`? (2) does the
> `optimizePackageImports` array in `next.config.ts` cover every barrel
> import we actually use (grep `from "lucide-react"`,
> `from "react-icons/...`", `from "framer-motion"`,
> `from "@base-ui/react"`)? (3) does the AGENTS.md edit follow the
> repo's existing heading style? Report findings only — do not fix.

### Step 7 — Commit message for semantic-release (→ orchestrator)

semantic-release uses Conventional Commits + the
`conventional-changelog-conventionalcommits` preset (see
`package.json` devDeps). A `perf:` type triggers a *patch* release and
appears under the **Performance Improvements** heading in CHANGELOG.md.

Use this message (HEREDOC, no `--no-verify`):

```text
perf: reduce client JS, font weight, and hex-grid canvas cost

- swap framer-motion `motion` for `m` under <LazyMotion features={domAnimation} strict>
  in the root layout, dropping ~25 kB from the initial bundle and shrinking
  hydration cost across hero, timeline, skills, and elsewhere sections
- code-split below-fold sections (about, author-note, skills, timeline,
  education, academic, languages, elsewhere) via next/dynamic so the hero
  hydrates first and section chunks load on demand
- subset Noto Sans to weights 400 and 600 with `display: swap`, cutting
  font payload roughly in half and removing FOIT
- hex-grid canvas: replace per-frame createRadialGradient calls with
  globalAlpha + solid-fill arcs, gate trails behind
  prefers-reduced-motion, scale max lights (12→6) and trail length
  (60→25) down on viewports < 640 px, early-exit on near-zero alpha
  trail dots
- statically generate all locales at build via generateStaticParams in
  app/[locale]/page.tsx
- wire up @next/bundle-analyzer (run with ANALYZE=true bun run build) for
  ongoing regression tracking
- pin dependency versions in package.json instead of floating `"latest"`
  to stop silent upgrades
- update framer-motion test mock to expose `m`, `LazyMotion`, and
  `domAnimation`
```

If Step 2's `optimizePackageImports` change is included, append:

```text
- enable Next.js optimizePackageImports for lucide-react, react-icons,
  framer-motion, and @base-ui/react to remove barrel-import cost on dev
  boot and cold start
```

Also append (Step 4):

```text
- document the @next/bundle-analyzer workflow in AGENTS.md
```

(Use `docs:` instead of `perf:` only if the AGENTS.md edit ships in a
separate commit. Bundling it into the perf commit is fine — keeps the
release self-contained.)

Stage everything currently modified plus `next.config.ts` edit and
`AGENTS.md`, then:

```bash
git commit -m "$(cat <<'EOF'
<message above>
EOF
)"
```

No `Co-Authored-By` footer needed unless the user asks (semantic-release
ignores it, but the project hasn't used it on previous `perf:` commits —
check `git log --grep '^perf'` first if uncertain).

### Step 8 — Verification (→ orchestrator + manual)

End-to-end checks before declaring done:

```bash
bun run lint          # Biome
bun run test          # Vitest unit + component (~under 60s)
bun run build         # Next.js production build
```

Then a manual smoke in the browser (`bun dev`):

- Hero loads, hex grid animates with theme color.
- Toggle theme — hex grid recolors.
- Switch reduced-motion in OS settings, reload — trails disappear, fills
  freeze.
- Resize to <640 px — hex grid uses smaller cells, fewer lights.
- Scroll the page — every section renders (i.e., dynamic imports hydrated).
- Open DevTools Network → reload → confirm Vercel Analytics request fires
  *after* main HTML.

## Critical Files

- `app/[locale]/layout.tsx:14-19` — font config
- `app/[locale]/layout.tsx:86-96` — LazyMotion wrapper
- `app/[locale]/page.tsx:5-32` — dynamic imports + generateStaticParams
- `components/hex-grid-background.tsx:92,123,199,241-273` — canvas perf
- `next.config.ts:1-9,45` — bundle analyzer (and where §1 edit goes)
- `test/mocks/framer-motion.tsx` — test surface

## Resume Note

If a future session is asked to "resume the perf work", it should:

1. Read `specs/003-perf-optimization/plan.md`.
2. Run `git status` — work picks up wherever §Step 2/3/4 left off.
3. Re-run `grep` for `motion\.` in `*.tsx` to confirm no regressions
   slipped in via merges.
