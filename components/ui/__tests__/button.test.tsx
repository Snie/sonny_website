import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
	it("renders with default variant", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
	});

	it.each([
		"outline",
		"secondary",
		"ghost",
		"destructive",
		"link",
	] as const)("renders %s variant", (variant) => {
		render(<Button variant={variant}>{variant}</Button>);
		expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
	});

	it.each(["default", "xs", "sm", "lg", "icon"] as const)("renders %s size", (size) => {
		render(<Button size={size}>Btn</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("handles onClick", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click</Button>);
		await user.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("renders as disabled", () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});
});
