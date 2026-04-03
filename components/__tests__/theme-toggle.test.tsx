vi.mock("@wrksz/themes/client", () => import("../../test/mocks/wrksz-themes"));

import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "../theme-toggle";

describe("ThemeToggle", () => {
  it("renders a button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays correct aria-label for dark theme", async () => {
    render(<ThemeToggle />);
    // After mount effect, the component shows the themed button
    await vi.waitFor(() => {
      expect(
        screen.getByLabelText(/Current theme: dark/),
      ).toBeInTheDocument();
    });
  });
});
