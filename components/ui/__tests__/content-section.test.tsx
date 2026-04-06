import { render, screen } from "../../../test/utils";
import { ContentSection } from "../content-section";

describe("ContentSection", () => {
	it("renders children", () => {
		render(<ContentSection>Hello world</ContentSection>);
		expect(screen.getByText("Hello world")).toBeInTheDocument();
	});

	it("renders heading when provided", () => {
		render(<ContentSection heading="My Heading">Content</ContentSection>);
		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("My Heading");
	});

	it("omits heading when not provided", () => {
		render(<ContentSection>Content</ContentSection>);
		expect(screen.queryByRole("heading")).not.toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<ContentSection className="custom-class">Content</ContentSection>);
		const section = screen.getByText("Content").closest("section");
		expect(section).toHaveClass("custom-class");
	});
});
