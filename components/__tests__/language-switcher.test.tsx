vi.mock("@base-ui/react/menu", () => import("../../test/mocks/base-ui-menu"));
vi.mock("next/navigation", () => ({
	usePathname: () => "/en",
}));

import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "../language-switcher";

describe("LanguageSwitcher", () => {
	it("renders the current locale in the trigger", () => {
		render(<LanguageSwitcher />);
		expect(screen.getByRole("button", { name: /EN/i })).toBeInTheDocument();
	});

	it("renders all locale options", () => {
		render(<LanguageSwitcher />);
		expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "IT" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "DE" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "FR" })).toBeInTheDocument();
	});

	it("locale links point to the correct href", () => {
		render(<LanguageSwitcher />);
		expect(screen.getByRole("link", { name: "IT" })).toHaveAttribute("href", "/it");
		expect(screen.getByRole("link", { name: "DE" })).toHaveAttribute("href", "/de");
	});

	it("highlights the current locale", () => {
		render(<LanguageSwitcher />);
		const currentLink = screen.getByRole("link", { name: "EN" });
		expect(currentLink.className).toContain("font-semibold");
	});
});
