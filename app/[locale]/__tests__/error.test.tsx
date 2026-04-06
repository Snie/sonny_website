import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "../error";

describe("Error boundary", () => {
	const mockError = new Error("Test error") as Error & { digest?: string };
	const mockReset = vi.fn();

	it("renders error message", () => {
		render(<ErrorPage error={mockError} reset={mockReset} />);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		expect(screen.getByText("An unexpected error occurred. Please try again.")).toBeInTheDocument();
	});

	it("renders 'Try again' button", () => {
		render(<ErrorPage error={mockError} reset={mockReset} />);
		expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
	});

	it("clicking 'Try again' calls reset", async () => {
		const user = userEvent.setup();
		render(<ErrorPage error={mockError} reset={mockReset} />);
		await user.click(screen.getByRole("button", { name: "Try again" }));
		expect(mockReset).toHaveBeenCalledOnce();
	});
});
