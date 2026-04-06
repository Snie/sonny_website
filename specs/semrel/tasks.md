# Tasks: Automated Semantic Releases

**Input**: `specs/semrel/spec.md`
**Branch**: `feat/semver`

## Format: `[ID] [P?] Description — file path`

- **[P]**: Can run in parallel (no inter-task dependency)
- No user story phases — this is a single pipeline feature, tasks are sequential by nature

---

## Phase 1: Setup — Install Dependencies

**Purpose**: Add semantic-release and its plugins to the project

- [x] T001 Install semantic-release devDependencies via `bun add -d semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/github conventional-changelog-conventionalcommits` — `package.json`, `bun.lock`

---

## Phase 2: Core Configuration

**Purpose**: Create the two files that define the release pipeline

- [x] T002 Create `.releaserc.yml` with plugin pipeline: commit-analyzer (conventionalcommits preset, custom `sec:` rule), release-notes-generator (custom sections), changelog, npm (no publish), git (commit assets), github — `.releaserc.yml`
- [x] T003 [P] Create `.github/workflows/release.yml` — trigger on push to `main`, `fetch-depth: 0`, `bun install --frozen-lockfile`, `bunx semantic-release` with `GITHUB_TOKEN`, pinned action commit hashes — `.github/workflows/release.yml`

---

## Phase 3: Documentation

**Purpose**: Document the release automation in README under `## CI/CD`

- [x] T004 Add `### Releases` subsection to README.md under `## CI/CD` — describe the semantic-release automation: what triggers a release, version bump table (feat→minor, fix/sec→patch, breaking→major), what the workflow produces (CHANGELOG.md, git tag, GitHub Release, package.json bump), and the `[skip ci]` release commit — `README.md`

---

## Phase 4: Verification

**Purpose**: Confirm the full pipeline works end-to-end

- [x] T005 Run `bunx semantic-release --dry-run` locally and confirm no config errors
- [ ] T006 After merging to `main`: verify `Release` workflow triggers in GitHub Actions, git tag is created, CHANGELOG.md appears, `package.json` version is bumped, GitHub Release is created with notes
- [ ] T007 Verify `sec:` commit type produces a patch bump and a "Security" section in CHANGELOG

---

## Dependencies & Execution Order

- **T001** must complete before T002 (deps needed to validate config)
- **T002 and T003** can run in parallel once T001 is done
- **T004** can run in parallel with T002/T003 (README edit, independent)
- **T005** requires T001 + T002
- **T006–T007** require a merge to `main` after all prior tasks

### Parallel Opportunities

```bash
# After T001:
Task T002: Create .releaserc.yml
Task T003: Create .github/workflows/release.yml
Task T004: Update README.md
```

---

## Implementation Strategy

1. T001 — install deps
2. T002 + T003 + T004 in parallel
3. T005 — dry-run validation locally
4. Commit, open PR to `dev`, then `dev` → `main`
5. T006 + T007 — verify live on `main`
