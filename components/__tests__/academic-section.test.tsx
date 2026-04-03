import { render, screen } from "../../test/utils";
import { AcademicSection } from "../academic-section";

describe("AcademicSection", () => {
  it("renders heading 'Academic Work'", () => {
    render(<AcademicSection />);
    expect(
      screen.getByRole("heading", { name: "Academic Work" }),
    ).toBeInTheDocument();
  });

  it("renders entry titles", () => {
    render(<AcademicSection />);
    expect(
      screen.getByText(
        "M.Sc. Thesis — Human-like Controllers for Simulated Cars",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "B.Sc. Thesis — Mobile Hyperspectral Imaging System for Grapevine Health Monitoring",
      ),
    ).toBeInTheDocument();
  });

  it("renders institutions", () => {
    render(<AcademicSection />);
    expect(screen.getByText("IDSIA")).toBeInTheDocument();
    expect(
      screen.getByText("Dolphin Engineering Sagl"),
    ).toBeInTheDocument();
  });
});
