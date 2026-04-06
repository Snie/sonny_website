import { render, screen } from "../../test/utils";
import { EducationSection } from "../education-section";

describe("EducationSection", () => {
	it("renders heading 'Education'", () => {
		render(<EducationSection />);
		expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();
	});

	it("renders degree titles", () => {
		render(<EducationSection />);
		expect(screen.getByText("M.Sc Master of Science in Informatics")).toBeInTheDocument();
		expect(screen.getByText("B.Sc Bachelor of Science in Informatics")).toBeInTheDocument();
	});

	it("renders institution names", () => {
		render(<EducationSection />);
		expect(screen.getAllByText("Università della Svizzera italiana (USI)")).toHaveLength(2);
	});
});
