vi.mock("framer-motion", () => import("../../test/mocks/framer-motion"));

const { IconStub } = vi.hoisted(() => {
  const IconStub = () => null;
  return { IconStub };
});

vi.mock("react-icons/si", () => ({
  SiPython: IconStub, SiJavascript: IconStub, SiTypescript: IconStub,
  SiCplusplus: IconStub, SiDocker: IconStub, SiKubernetes: IconStub,
  SiAnsible: IconStub, SiTerraform: IconStub, SiJenkins: IconStub,
  SiGit: IconStub, SiGithubactions: IconStub, SiPytorch: IconStub,
  SiApachekafka: IconStub, SiApachespark: IconStub, SiMysql: IconStub,
  SiSplunk: IconStub, SiGrafana: IconStub, SiHtml5: IconStub,
  SiReact: IconStub, SiNodedotjs: IconStub, SiNextdotjs: IconStub,
  SiGithub: IconStub, SiBun: IconStub, SiSonar: IconStub,
  SiUv: IconStub, SiRuff: IconStub, SiAstral: IconStub,
  SiPrecommit: IconStub, SiMlflow: IconStub, SiClaude: IconStub,
}));
vi.mock("react-icons/fa6", () => ({
  FaJava: IconStub, FaCss3Alt: IconStub,
}));
vi.mock("react-icons/fa", () => ({
  FaAws: IconStub,
}));
vi.mock("react-icons/vsc", () => ({
  VscAzure: IconStub, VscCopilot: IconStub,
}));

import { render, screen } from "../../test/utils";
import { SkillsSection } from "../skills-section";

describe("SkillsSection", () => {
  it("renders heading 'Stack'", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("heading", { name: "Stack" }),
    ).toBeInTheDocument();
  });

  it("renders all 8 category titles", () => {
    render(<SkillsSection />);
    const expected = [
      "Languages",
      "Code Quality & Build",
      "Infrastructure & DevOps",
      "Cloud",
      "Data & ML",
      "Observability",
      "Web",
      "AI Tooling",
    ];
    for (const title of expected) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("spot-checks tool names", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
