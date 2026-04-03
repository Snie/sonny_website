vi.mock("framer-motion", () => import("../../test/mocks/framer-motion"));

import { render, screen } from "../../test/utils";
import { Timeline } from "../timeline";

describe("Timeline", () => {
  it("renders heading 'Work Experience'", () => {
    render(<Timeline />);
    expect(
      screen.getByRole("heading", { name: "Work Experience" }),
    ).toBeInTheDocument();
  });

  it("renders all 5 entry roles", () => {
    render(<Timeline />);
    expect(
      screen.getByText("ML Tech Lead & Solution Architect"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Lead Data Scientist & ML Engineer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Data Scientist & ML Engineer"),
    ).toBeInTheDocument();
    expect(screen.getByText("Data Engineer")).toBeInTheDocument();
    expect(
      screen.getByText("Security Analyst & Big Data Engineer"),
    ).toBeInTheDocument();
  });

  it("renders companies and periods", () => {
    render(<Timeline />);
    expect(screen.getAllByText("Swiss Post")).toHaveLength(4);
    expect(screen.getByText("Kstone SA")).toBeInTheDocument();
    expect(screen.getByText("2026 – Present")).toBeInTheDocument();
    expect(screen.getByText("2019 – 2020")).toBeInTheDocument();
  });
});
