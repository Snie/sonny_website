---
paths:
  - "**/__tests__/**"
  - "test/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing

Conventions for unit, component, and E2E tests. Loaded automatically when working with test files.

## Rules

- Co-locate test files in `__tests__/` directories next to source files.
- Use real translations (`messages/en.json`) via the custom render wrapper in `test/utils.tsx`.
- Mock external dependencies (framer-motion, react-icons, next/image, next/link) using mocks in
  `test/mocks/`.
- No snapshot testing or visual regression testing.
- Tests must be deterministic and fast (full suite under 60 seconds).

## Commands

```bash
bun run test        # Unit and component tests (Vitest)
bun run test:watch  # Watch mode during development
bun run test:e2e    # E2E smoke test (Playwright, builds the app)
bun run test:all    # Run unit + E2E tests
```
