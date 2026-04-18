# Sonny Website

Hello there, my name is Sonny Monti and this project is the placeholder for my personal website.  

Built with Next.js 16, React 19, Tailwind CSS v4, TypeScript 6, and `next-intl`
for English / Italian / German / French. Deployed on Vercel.

The websites will explain who I am, be my online resume, and serve as sandbox for my experiments such as ML, AI or
 other software projects worth to operationalize behind an API.

**Author notes baby!**

At the time I wrote this note in 2026 (and believe me or not but I manually wrote most of it),
 my job was ML Tech Lead at the Swiss Post, AI agentic development was in its golden age, so as LLMs,
 and the word AI was used more than the word *the*. At the time I will read this paragraph again
 AI will have reached the terminator level, rule human.... heeeam, I will be a farmer and live the best life!  

Jokes aside, I wanted to tell you this story because, despite the immense advancements done by coding agents, I believe
 that good engineers with deep architectural skills so as experience in designing systems
 and interfaces will be still needed for a while.  
Letting AI vibecode entire application stacks without carefully inspecting its work is the perfect recipe for
 disasters, because agents consume interfaces. They never invent them. If an agent is deciding what an API endpoint
 looks like, the process is already broken.  

That said, welcome to my website project and have a good reading here.

> **Be aware:** This project may contain brogrammer jokes, rude expressions, funny, outrageous or even profane text.
 Reviewers discretion is advised my fellow readers!;)

## Prequisites

- [bun](https://bun.com/) a modern 4 in 1 all-in-one js toolkit. It contains a package manager, js runtime,
 test runner, and bundler
- `markdownlint-cli2` for linting markdown
- GitHub account with dependabot and codereview enabled
- GitHub branch protection rules on `main` and `dev` with required status checks for testing
  (enables Dependabot auto-merge to gate on CI — see [CI/CD](#cicd) section)
- My own GitHub app to allow the the `semantic-release` bot doing releases with respect to conventional commits

### AI development

The project can, and is developed manually. However, install the following to use AI Agents and do Spec-Driven-Design:

- An LLM, and a good coding agent of course ;)
  - Coding agents configuration in this repo is made to be portable and compatible with the standard configurations.
  However, `Claude Code` is advised since the configuration may have Claude specific config. and rules
- [GitHub Spec Kit](https://github.com/github/spec-kit) used for SDD
  - `uv` uv is used to install GH Spec Kit
- Keep track of used tokens using ccusage `bunx ccusage blocks`
- [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills/tree/main) —
  a curated skill library for coding agents. Install or update with:

  ```shell
  bunx antigravity-awesome-skills --claude
  ```

  Active bundles for this project: **Essentials**, **Web Wizard**, **Full-Stack Developer**,
  **Security Engineer**. See [AGENTS.md](AGENTS.md) for the full skill list.

  > **hint:** re-running the command above also updates all skills to the latest version.

- [Context7](https://context7.com/) MCP server for up-to-date library documentation. Install or update with:

  ```shell
  npx ctx7 setup
  ```

> **Keep tooling fresh:** all external tools (Context7, antigravity skills, Spec Kit, Bun)
> should be updated periodically. See [AGENTS.md](AGENTS.md) for the full update table.

## Quick start

To launch the dev server:

```shell
bun dev
```

## Repository Structure

```text
.
├── app/          # Next.js app router (pages, layouts, global styles)
├── components/   # React UI components
├── docs/         # Developer documentation
├── public/       # Static assets
├── types/        # Shared TypeScript types
├── lib/          # Utility functions and i18n configuration
└── test/         # Test infrastructure, mocks, and E2E specs
```

## Contributing and Development

The project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for spec-driven development.
Use conventional commits, feature branches (`feat/<name>`, `fix/<name>`), and never push directly to `main`.

See [AGENTS.md](AGENTS.md) for the full SDD workflow, git conventions, and agent instructions.

## Documentation

As a general outline, refer to this README.md to have an overview on the project and quick start guides.  
Whereas AGENTS.md contains technical documentation and precise commands to operate on this repository,
principally for agents but also for humans.  

The repository comes with markdownlint-cli2, a powerful tool to lint markdowns, I know it may be fucking annoying but
clean .md files are beautiful and llms can better work with them ;)

> **hint:** use the readme-agents-sync skill to let a coding agent inspect and synchronize README.md and AGENTS.md.  
> **warning**: if contributing, not documenting, not using conventional commits or nor using linting and formatting tools,
Sonny Monti will receive a cosmic message from the GitHub gods and get really angry,
 he really hates dirty code and messy docs...

### CHANGELOG.md

Keep a nice changelog following [the keep a changelog standard](https://keepachangelog.com/en/1.1.0/) to track
 what features have been implemented and when, this helps developers and makes Sonny happy
 to write even more documentation, despite being a lazy ass by nature. Lol, that was a typical brogrammer joke bro!
 He loves writing detailed docs!

## Webpage style

TODO

## CI/CD

### CI/DC utilities

This repository utilizes the following tooling and configurations to have a pleasant and precise software development
lifecycle, ensure maintainability and repeatability architectural principles, but mostly to automate the SH out of IT
(this was another brogrammer joke if you are wondering what the hell this means).

### Branching strategy

```text
feat/<name>  ──┐
fix/<name>   ──┴──► dev (PR + CI) ──► main (PR + CI + manual approval)
                         ▲
dependabot PRs ──────────┘ (auto-merge when unit + e2e pass)
```

- `feat/*` and `fix/*` branches open a PR targeting `dev`
- CI runs unit and E2E tests on every PR
- `dev` → `main` requires a manual PR approval — no auto-merge

### GitHub configuration

- GitHub dependabot to conduct security scans, update modules through pull requests
- GitHub codescan to find nasty misconfiguration and issues in the code
- GitHub action for `markdownlint-cli2`

> **hint**: use the skill `github-dependabot` to see dependabot alerts and also pull requests for dependencies.  
>
> Use the skill `github-check-jobs` to grab failing jobs

### Releases

Releases are fully automated via [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
triggered on every push to `main`. No manual versioning required.

**What triggers a release:**

| Commit type | Version bump | CHANGELOG section |
| --- | --- | --- |
| `feat:` | minor | Features |
| `fix:` | patch | Bug Fixes |
| `sec:` | patch | Security |
| `feat!:` / `BREAKING CHANGE:` | major | Breaking Changes |
| `chore:`, `docs:`, `refactor:`, `test:` | none | — |

**What the workflow produces on a release:**

1. `CHANGELOG.md` updated with grouped release notes
2. `package.json` version bumped
3. Commit pushed: `chore(release): x.y.z [skip ci]`
4. Git tag `vx.y.z` created
5. GitHub Release created with full notes

The release commit includes `[skip ci]` to prevent CI from re-triggering on the automated bump.
Dependabot PRs merged into `dev` and then promoted to `main` via a conventional commit
(e.g. `chore(deps): update dependencies`) will not trigger a release.

### Dependency management

Dependabot runs weekly and opens PRs targeting `dev` for patch and minor updates.
Major version bumps are intentionally **blocked** — they require a manual PR.
Dependabot PRs auto-merge once `unit` and `e2e` pass.

To inspect dependencies locally:

```shell
bun outdated          # show all outdated packages with current/latest versions
bun update            # update within semver ranges (respects package.json constraints)
bun update --latest   # ignore semver ranges, pull everything to latest (use with care)
```

Major upgrades should be done manually, one package at a time, with a dedicated `feat/upgrade-<pkg>` branch.
