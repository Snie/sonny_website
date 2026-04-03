# Quickstart: Unit Test Suite

## Prerequisites

- Bun 1.3.11+
- Node v25+

## Setup

```bash
# Install test dependencies
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react vite-tsconfig-paths jsdom @playwright/test

# Install Playwright browser (for E2E tests only)
bunx playwright install --with-deps chromium
```

## Running Tests

```bash
# Unit and component tests
bun test

# Watch mode (during development)
bun run test:watch

# E2E smoke test (builds and starts the app)
bun run test:e2e

# Run everything
bun run test:all
```

## Writing a New Component Test

1. Create `components/__tests__/my-component.test.tsx`
2. Import the custom render from `test/utils.tsx`
3. Use real translations for content verification

```tsx
import { render, screen } from "../../../test/utils";
import { MyComponent } from "../my-component";

describe("MyComponent", () => {
  it("renders expected content", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected heading")).toBeInTheDocument();
  });
});
```

## Writing a New Utility Test

1. Create `lib/__tests__/my-util.test.ts`
2. Cover normal, edge case, and empty/null inputs

```ts
import { myUtil } from "../my-util";

describe("myUtil", () => {
  it("handles normal input", () => { /* ... */ });
  it("handles edge case", () => { /* ... */ });
  it("handles empty input", () => { /* ... */ });
});
```

## GitHub Actions

- **test.yml**: Runs unit + E2E tests on every PR to main
- **dependabot-auto-merge.yml**: Auto-merges patch/minor Dependabot PRs after all checks pass
