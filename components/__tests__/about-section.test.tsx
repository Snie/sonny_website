import { render, screen } from "../../test/utils";
import { AboutSection } from "../about-section";

describe("AboutSection", () => {
  it("renders heading 'About'", () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("heading", { name: "About" }),
    ).toBeInTheDocument();
  });

  it("contains about.text paragraphs", () => {
    render(<AboutSection />);
    expect(
      screen.getByText(/ML Tech Lead at Swiss Post/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I specialize in Python-based ML engineering/),
    ).toBeInTheDocument();
  });
});
