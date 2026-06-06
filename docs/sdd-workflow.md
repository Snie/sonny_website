# Spec-Driven Development & Subagent Orchestration

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for Spec-Driven
Development (SDD). Spec artifacts live in `specs/<feature>/`.

## Role split between human and agent

- Human = spec owner + evaluator (defines WHAT and WHY, never HOW).
- Powerful and expensive LLM = lead orchestrator (architecture decisions, spec review).
- Less powerful and cheaper LLM = subagent worker.

## Subagent Orchestration

When the user asks to "work with subagents" or "use agents", the orchestrator (Opus) delegates
tasks from the active spec's `tasks.md` to specialized subagents defined in `.claude/agents/`. The
orchestrator reads the tasks, decides which agent handles each task, and parallelizes independent
work.

### Available subagents

| Agent | Model | Scope | Color | Memory |
| --- | --- | --- | --- | --- |
| `frontend` | claude-sonnet-4-6 | Next.js, React, Tailwind — UI components, pages, styling | cyan | project |
| `tester` | claude-sonnet-4-6 | Vitest, RTL, Playwright — tests, test infra, test fixing | green | project |
| `reviewer` | claude-sonnet-4-6 | Code review — bugs, security, performance, conventions | purple | project |

All subagents have access to Context7 MCP, respect the rules in `AGENTS.md`, and have project-scoped
persistent memory.

### Delegation rules

1. **Orchestrator reads** `specs/<feature>/tasks.md` to understand the full task list.
2. **Orchestrator prompts each subagent** with enough context from the spec, plan, and task
   description so the subagent can execute without additional discovery.
3. **Parallelism**: tasks marked `[P]` in the same phase are dispatched in parallel.
4. **Sequential**: tasks without `[P]` or cross-phase dependencies run sequentially.
5. **Review gate**: after each phase, the orchestrator may dispatch the `reviewer` agent to check
   the work before proceeding.
6. **Test fixing**: when tests fail, the orchestrator dispatches the `tester` agent with the
   `@test-fixing` skill to diagnose and fix failures.

### Task-to-agent mapping

| Task type | Agent |
| --- | --- |
| Component creation, styling, layouts | `frontend` |
| Test files, test infrastructure, mocks | `tester` |
| E2E tests (Playwright) | `tester` |
| CI workflows, GitHub Actions | orchestrator (Opus) |
| Documentation updates (AGENTS.md, specs) | orchestrator (Opus) |
| Code review after implementation | `reviewer` |

### How to invoke

Tell the orchestrator `work with subagents`, or with Spec Kit:

```text
/speckit.implement work with subagents
```

The orchestrator loads the tasks, delegates to the appropriate agents, and coordinates the work.
