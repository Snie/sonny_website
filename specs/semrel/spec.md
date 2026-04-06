# Plan: Automated Semantic Releases with Conventional Commits

## Context

The project uses conventional commits and Bun, but has no automated versioning or release process today.
The goal is automatic version bumping, CHANGELOG generation, and GitHub releases driven purely by commit messages —
equivalent to what `uv version --bump` + python-semantic-release provides in Python projects.

**Current state:**

- No tags, no CHANGELOG.md, no release config
- `package.json` pinned at `0.1.0`
- Dependabot auto-merges patch/minor into `dev`; user manually opens the `dev` → `main` PR with a
  conventional commit message
- Valid commit types: `feat`, `fix`, `sec`, `chore`, `docs`, `refactor`, `test`, `BREAKING CHANGE`

---

## How Releases Are Triggered

| Commit type | Version bump | Release? | CHANGELOG section |
|---|---|---|---|
| `feat:` | minor | yes | Features |
| `fix:` | patch | yes | Bug Fixes |
| `sec:` | patch | yes | Security |
| `BREAKING CHANGE:` / `feat!:` | major | yes | Breaking Changes |
| `chore:`, `docs:`, `refactor:`, `test:` | none | no | — |

`sec:` is a custom type not in the Angular/Conventional Commits defaults, so it must be configured
in both the commit-analyzer and the release-notes-generator plugins.

---

## Dependabot Flow (no special config needed)

```text
Dependabot PR  →  auto-merge into dev  →  user opens dev→main PR
                                          with conventional commit message
                                          e.g. "chore(deps): update all dependencies"
                                          or   "fix(deps): patch lodash CVE"
```

semantic-release only runs on push to `main` and only reads commits since the last tag.
The merge commit message drives the version decision. No changes to the existing auto-merge workflow are needed.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `.releaserc.yml` | **create** — plugin pipeline config |
| `.github/workflows/release.yml` | **create** — CI trigger on push to `main` |
| `package.json` | **modify** — add 5 devDeps |
| `bun.lock` | auto-updated by `bun install` |
| `CHANGELOG.md` | auto-generated at repo root on first release |

---

## Step 1 — Install devDependencies

```bash
bun add -d semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github conventional-changelog-conventionalcommits
```

`conventional-changelog-conventionalcommits` is required to configure custom commit types (`sec:`)
in both the analyzer and the release notes generator.

---

## Step 2 — `.releaserc.yml`

```yaml
branches:
  - main

plugins:
  - - "@semantic-release/commit-analyzer"
    - preset: conventionalcommits
      releaseRules:
        - type: feat
          release: minor
        - type: fix
          release: patch
        - type: sec
          release: patch
        - breaking: true
          release: major

  - - "@semantic-release/release-notes-generator"
    - preset: conventionalcommits
      presetConfig:
        types:
          - type: feat
            section: "Features"
            hidden: false
          - type: fix
            section: "Bug Fixes"
            hidden: false
          - type: sec
            section: "Security"
            hidden: false
          - type: chore
            section: "Chores"
            hidden: true
          - type: docs
            section: "Documentation"
            hidden: true
          - type: refactor
            section: "Refactoring"
            hidden: true
          - type: test
            section: "Tests"
            hidden: true

  - "@semantic-release/changelog"

  - - "@semantic-release/npm"
    - npmPublish: false           # bumps package.json version only, no registry publish

  - - "@semantic-release/git"
    - assets:
        - CHANGELOG.md
        - package.json
      message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"

  - "@semantic-release/github"
```

Plugin order matters — changelog must be written before git commits it.
`[skip ci]` in the release commit message prevents the test workflow from re-triggering on
the automated version bump commit.

---

## Step 3 — `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false    # never cancel a running release mid-flight

permissions:
  contents: write              # push release commit + create tags
  issues: write                # GitHub plugin: comment on referenced issues
  pull-requests: write         # GitHub plugin: comment on referenced PRs

jobs:
  release:
    name: Semantic Release
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          fetch-depth: 0          # full history required to find previous tags
      - uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6
      - run: bun install --frozen-lockfile
      - run: bunx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

`fetch-depth: 0` is critical — semantic-release must walk the full commit history to find
the previous release tag and scope the changelog to commits since then.

---

## What Happens on a Release (end-to-end)

1. PR merged to `main` with a `feat:` / `fix:` / `sec:` / breaking commit
2. `release.yml` triggers
3. semantic-release scans commits since last tag, determines next version
4. Generates release notes grouped by type
5. Writes / updates `CHANGELOG.md`
6. Bumps `version` in `package.json`
7. Commits both files: `chore(release): 1.0.0 [skip ci]`
8. Pushes git tag `v1.0.0`
9. Creates GitHub Release with full notes

---

## Optional: Pre-release channel on `dev`

If you want `dev` pushes to produce `1.1.0-beta.1` style pre-releases, extend `.releaserc.yml`:

```yaml
branches:
  - main
  - name: dev
    prerelease: beta
```

Not included by default.

---

## Verification

After implementation:

1. Merge a `feat: add something` commit to `main`
2. Confirm `Release` workflow triggers and passes in GitHub Actions
3. `git tag --sort=-v:refname | head -5` → should show `v0.2.0`
4. `CHANGELOG.md` created at repo root with a "Features" section
5. `package.json` `"version"` field bumped accordingly
6. GitHub → Releases tab shows a new release with generated notes
7. Test `sec:` commit similarly → patch bump, "Security" section in CHANGELOG

---

## Notes on Bun compatibility

semantic-release is an npm package running under Node.js. Bun installs and executes it normally
(`bunx semantic-release`). Dependabot already tracks the `bun` ecosystem and will keep the new
devDeps updated automatically.
