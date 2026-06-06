---
name: claude-code
description: Governs this project's .claude/ directory. Load when creating or modifying skills, settings, hooks, agents, or rules. Encodes Claude Code core concepts and best practices.
metadata:
  update-policy: monthly
  update-source: https://code.claude.com/docs/
  last-updated: "2026-06-06"
---

# Claude Code: Working on the .claude/ Directory

Apply these rules whenever you read, create, or modify any file inside `.claude/`.

## Directory Layout

The `.claude/` directory at project root is the main configuration location for this project:

```text
.claude/
├── skills/       # Project-scoped skills (committed to version control)
│   └── <name>/
│       └── SKILL.md   # Required entry point for every skill
├── agents/       # Custom subagent definitions
├── rules/        # Path-scoped rules loaded by glob pattern
├── settings.json # Project settings: permissions, environment, hooks
└── memory/       # Auto-memory written by Claude — do not hand-edit
```

Personal skills live in `~/.claude/skills/` and apply across all projects.
Project skills live in `.claude/skills/` and are committed to version control.

## Skills

Every skill lives in its own subdirectory and requires a `SKILL.md` entry point.
Additional files (templates, scripts, reference docs) may sit alongside it.
Keep `SKILL.md` under 500 lines; move large reference material to supporting files.

### Frontmatter Schema

Every `SKILL.md` in this project must open with YAML frontmatter between `---` markers.
All standard fields are optional; only `description` is recommended so Claude knows when to use
the skill. The command you type (`/name`) comes from the **directory name**, not the `name` field.
See the [official frontmatter reference](https://code.claude.com/docs/en/skills#frontmatter-reference).

| Field | Required | Description |
| ----- | -------- | ----------- |
| `name` | No | Display name shown in skill listings. Defaults to the directory name. Does not change the `/command` (except for a plugin-root `SKILL.md`). |
| `description` | Recommended | What the skill does and when to use it. Front-load the key use case. Combined with `when_to_use`, truncated at 1,536 chars in the skill listing. |
| `when_to_use` | No | Extra trigger phrases / example requests. Appended to `description`; counts toward the 1,536-char cap. |
| `disable-model-invocation` | No | `true` — user-only (`/name`); description not in Claude's context. Default `false`. |
| `user-invocable` | No | `false` — hide from `/` menu, Claude-only background knowledge. Default `true`. |
| `allowed-tools` | No | Tools pre-approved (no permission prompt) while the skill is active. Space/comma string or YAML list. |
| `disallowed-tools` | No | Tools removed from the pool while the skill is active. Clears on your next message. |
| `argument-hint` | No | Autocomplete hint for expected args, e.g. `[issue-number]`. |
| `arguments` | No | Named positional args for `$name` substitution. Space-separated string or YAML list. |
| `model` | No | Model to use while active (same values as `/model`, or `inherit`). Resumes session model next prompt. |
| `effort` | No | Effort level while active: `low` \| `medium` \| `high` \| `xhigh` \| `max` (model-dependent). |
| `context` | No | `fork` runs the skill in an isolated subagent. |
| `agent` | No | Subagent type when `context: fork` is set (e.g. `Explore`, `Plan`, `general-purpose`, or a custom agent). |
| `paths` | No | Glob patterns that limit when the skill auto-activates. |
| `hooks` | No | Hooks scoped to this skill's lifecycle. |
| `shell` | No | Shell for `` !`command` `` injection: `bash` (default) or `powershell`. |
| `metadata` | Yes | Project-specific block. Not part of the Claude Code standard. |
| `metadata.update-policy` | Yes | `monthly` \| `quarterly` \| `manual` \| `never` |
| `metadata.update-source` | Yes | URL to fetch directly, or `web-search` for official docs search. |
| `metadata.last-updated` | Yes | Date content was last refreshed: `YYYY-MM-DD`. |

### Invocation Modes

| Mode | Frontmatter | Effect |
| ---- | ----------- | ------ |
| Default | (none) | Both Claude and user can invoke. Description always in context. |
| User-only | `disable-model-invocation: true` | Only `/name` works. Not in Claude's context. |
| Claude-only | `user-invocable: false` | Claude loads it; hidden from the / menu. |

Use `disable-model-invocation: true` for skills with side effects (deploy, commit, send messages).
Use `user-invocable: false` for background knowledge that is not a meaningful user action.

### context: fork

Add `context: fork` to run a skill in an isolated subagent. The SKILL.md content becomes the task
prompt. The subagent has no access to the current conversation history. Use the `agent` field to
pick the subagent type (defaults to `general-purpose`); the built-in `Explore` and `Plan` agents
skip CLAUDE.md and git status to keep their context small.

Only use `context: fork` for skills with self-contained, actionable instructions. Skills that
provide reference guidelines without a concrete task are not suited to fork execution.

### Supporting Files

Reference supporting files from `SKILL.md` so Claude knows what each file contains:

```text
my-skill/
├── SKILL.md        # Overview and navigation (required)
├── reference.md    # Detailed reference — loaded only when needed
└── scripts/
    └── helper.py   # Utility script — executed, not loaded into context
```

## Settings

`.claude/settings.json` controls permissions, environment variables, and hooks for this project.
Never commit secrets. Use environment variables or a secrets manager.

## Hooks

Hooks run shell commands in response to Claude Code events.
Define them in `settings.json` under `hooks`, or in a skill's frontmatter under `hooks`.

## CLAUDE.md

`CLAUDE.md` at project root is loaded into every session. Keep it under 200 lines.
Move task-specific content to skills or path-scoped rules so it loads only when needed.

## Best Practices

- Front-load the description's key use case; `description` + `when_to_use` are truncated at
  1,536 chars in the skill listing.
- `allowed-tools` pre-approves tools (no permission prompt) — it does not restrict the pool. To
  block tools, use `disallowed-tools` or deny rules in permission settings.
- Keep the skill body concise: once invoked, its content stays in context for the rest of the
  session, so every line is a recurring token cost.
- Do not hand-edit `.claude/memory/`. Claude manages it automatically.

See the [skills documentation](https://code.claude.com/docs/en/skills) for the full reference.
