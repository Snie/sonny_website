import { render, screen } from "@testing-library/react";
import { jsonTextToHtml } from "../text-utils";

describe("jsonTextToHtml", () => {
  it("renders multiple paragraphs for multi-line text", () => {
    const result = jsonTextToHtml("Line 1\nLine 2\nLine 3");
    render(<div>{result}</div>);
    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Line 2")).toBeInTheDocument();
    expect(screen.getByText("Line 3")).toBeInTheDocument();
    expect(screen.getByText("Line 1").tagName).toBe("P");
  });

  it("renders one paragraph for single line", () => {
    const result = jsonTextToHtml("Only line");
    render(<div>{result}</div>);
    expect(screen.getByText("Only line").tagName).toBe("P");
  });

  it("returns empty array for empty string", () => {
    const result = jsonTextToHtml("");
    expect(result).toHaveLength(0);
  });

  it("filters whitespace-only lines", () => {
    const result = jsonTextToHtml("\n  \n");
    expect(result).toHaveLength(0);
  });
});
