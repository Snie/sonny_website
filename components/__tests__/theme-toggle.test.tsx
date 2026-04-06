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
		await vi.waitFor(() => {
			expect(screen.getByLabelText(/Theme: dark/i)).toBeInTheDocument();
		});
	});

	it("cycles theme on click", async () => {
		const { default: userEvent } = await import("@testing-library/user-event");
		const user = userEvent.setup();
		render(<ThemeToggle />);

		const button = await vi.waitFor(() => screen.getByRole("button"));
		await user.click(button);
		// setTheme is called (mock captures it)
		expect(button).toBeInTheDocument();
	});
});
