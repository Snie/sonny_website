import { render, screen } from "../../test/utils";
import { AuthorNote } from "../author-note";

describe("AuthorNote", () => {
	it("renders without error", () => {
		render(<AuthorNote />);
		expect(screen.getByText(/At the time I wrote this note in 2026/)).toBeInTheDocument();
	});

	it("contains authorNote.text paragraphs", () => {
		render(<AuthorNote />);
		expect(screen.getByText(/Jokes aside, I wanted to tell you this story/)).toBeInTheDocument();
		expect(screen.getByText(/welcome to my website project/)).toBeInTheDocument();
	});
});
