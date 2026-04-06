vi.mock("next/link", () => import("../../test/mocks/next-link"));
vi.mock("next/navigation", () => ({
	usePathname: () => "/en",
}));

import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "../language-switcher";

describe("LanguageSwitcher", () => {
	it("renders 4 locale buttons", () => {
		render(<LanguageSwitcher />);
		expect(screen.getByText("EN")).toBeInTheDocument();
		expect(screen.getByText("IT")).toBeInTheDocument();
		expect(screen.getByText("DE")).toBeInTheDocument();
		expect(screen.getByText("FR")).toBeInTheDocument();
	});

	it("highlights the current locale", () => {
		render(<LanguageSwitcher />);
		const enButton = screen.getByLabelText("Switch to EN");
		expect(enButton).toHaveAttribute("aria-current", "true");

		const itButton = screen.getByLabelText("Switch to IT");
		expect(itButton).not.toHaveAttribute("aria-current");
	});
});
