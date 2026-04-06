import { render } from "@testing-library/react";
import Loading from "../loading";

describe("Loading", () => {
	it("renders spinner with animate-spin", () => {
		const { container } = render(<Loading />);
		const spinner = container.querySelector(".animate-spin");
		expect(spinner).toBeInTheDocument();
	});
});
