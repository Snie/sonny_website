vi.mock("framer-motion", () => import("../../test/mocks/framer-motion"));
vi.mock("next/image", () => import("../../test/mocks/next-image"));

const { IconStub } = vi.hoisted(() => {
  const IconStub = () => null;
  return { IconStub };
});

vi.mock("react-icons/si", () => ({ SiAcm: IconStub }));
vi.mock("react-icons/gi", () => ({ GiSwissArmyKnife: IconStub, GiGrapes: IconStub }));
vi.mock("react-icons/fa", () => ({ FaXbox: IconStub, FaPlaystation: IconStub }));
vi.mock("react-icons/fa6", () => ({}));
vi.mock("react-icons/tb", () => ({ TbSnowboarding: IconStub }));
vi.mock("react-icons/md", () => ({ MdSportsTennis: IconStub }));
vi.mock("react-icons/io5", () => ({ IoMusicalNotes: IconStub }));
vi.mock("lucide-react", () => ({ ExternalLink: IconStub }));

import { render, screen } from "../../test/utils";
import { ElsewhereSection } from "../elsewhere-section";

describe("ElsewhereSection", () => {
  it("renders heading 'Elsewhere'", () => {
    render(<ElsewhereSection />);
    expect(
      screen.getByRole("heading", { name: "Elsewhere" }),
    ).toBeInTheDocument();
  });

  it("renders all card titles", () => {
    render(<ElsewhereSection />);
    const titles = [
      "ACM",
      "Swiss Army",
      "Cantina Monti",
      "Music & Gaming",
      "Tennis & Snowboard",
    ];
    for (const title of titles) {
      // Cards are rendered twice (desktop + mobile layouts)
      const elements = screen.getAllByText(title);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });
});
