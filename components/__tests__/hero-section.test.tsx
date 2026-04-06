vi.mock("framer-motion", () => import("../../test/mocks/framer-motion"));
vi.mock("next/image", () => import("../../test/mocks/next-image"));
vi.mock("@wrksz/themes/client", () => import("../../test/mocks/wrksz-themes"));

const { IconStub } = vi.hoisted(() => {
	const IconStub = () => null;
	return { IconStub };
});

vi.mock("react-icons/fa", () => ({ FaLinkedin: IconStub }));
vi.mock("react-icons/md", () => ({ MdEmail: IconStub }));
vi.mock("react-icons/si", () => ({ SiGithub: IconStub }));
vi.mock("@/components/hex-grid-background", () => ({
	HexGridBackground: () => <div data-testid="hex-grid" />,
}));
vi.mock("@/components/ui/video-text", () => ({
	VideoText: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
// Mock static image import
vi.mock("../public/sonny_frontpage.webp", () => ({
	default: { src: "/sonny_frontpage.webp", height: 100, width: 100 },
}));

import { render, screen } from "../../test/utils";
import { HeroSection } from "../hero-section";

describe("HeroSection", () => {
	it("renders intro text", () => {
		render(<HeroSection />);
		expect(
			screen.getByText(
				"Tech Lead job, Engineer hands, Architect brain, and continuous learner soul",
			),
		).toBeInTheDocument();
	});

	it("renders title text", () => {
		render(<HeroSection />);
		expect(screen.getByText("Ciao, I'm Sonny")).toBeInTheDocument();
	});
});
