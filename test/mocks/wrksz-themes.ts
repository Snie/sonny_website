import { vi } from "vitest";

export const useTheme = () => ({
  theme: "dark",
  setTheme: vi.fn(),
  resolvedTheme: "dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return children;
}
