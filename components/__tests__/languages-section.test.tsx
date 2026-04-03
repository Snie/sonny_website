vi.mock("@wrksz/themes/client", () => import("../../test/mocks/wrksz-themes"));
vi.mock("react-apexcharts", () => import("../../test/mocks/react-apexcharts"));
vi.mock("next/dynamic", () => ({
  default: () => {
    return function DynamicMock(props: Record<string, unknown>) {
      return <div data-testid="apex-chart" />;
    };
  },
}));

import { render, screen } from "../../test/utils";
import { LanguagesSection } from "../languages-section";

describe("LanguagesSection", () => {
  it("renders heading 'Languages'", () => {
    render(<LanguagesSection />);
    expect(
      screen.getByRole("heading", { name: "Languages" }),
    ).toBeInTheDocument();
  });

  it("renders chart via mock", () => {
    render(<LanguagesSection />);
    expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
  });
});
