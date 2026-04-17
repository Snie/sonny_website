"use client";

import { m } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { AiFillRobot } from "react-icons/ai";
import { FaAws, FaDatabase } from "react-icons/fa";
import { FaCss3Alt, FaJava } from "react-icons/fa6";
import {
	SiAnsible,
	SiApachekafka,
	SiApachespark,
	SiAstral,
	SiBun,
	SiClaude,
	SiCplusplus,
	SiDocker,
	SiGit,
	SiGithub,
	SiGithubactions,
	SiGrafana,
	SiHtml5,
	SiJavascript,
	SiJenkins,
	SiKubernetes,
	SiLangchain,
	SiMlflow,
	SiMysql,
	SiNextdotjs,
	SiNodedotjs,
	SiOpensearch,
	SiPrecommit,
	SiPython,
	SiPytorch,
	SiReact,
	SiRuff,
	SiSonar,
	SiSplunk,
	SiTerraform,
	SiTypescript,
	SiUv,
} from "react-icons/si";
import { VscAzure, VscCopilot } from "react-icons/vsc";
import { ContentSection } from "@/components/ui/content-section";

interface Tool {
	name: string;
	icon: IconType | LucideIcon;
	isDormant?: boolean;
}

interface Category {
	titleKey: string;
	tools: Tool[];
	span?: "normal" | "wide";
}

const categories: Category[] = [
	{
		titleKey: "languages",
		tools: [
			{ name: "Python", icon: SiPython },
			{ name: "JavaScript", icon: SiJavascript },
			{ name: "TypeScript", icon: SiTypescript },
			{ name: "Java", icon: FaJava, isDormant: true },
			{ name: "C/C++", icon: SiCplusplus, isDormant: true },
		],
	},
	{
		titleKey: "codeQuality",
		tools: [
			{ name: "UV", icon: SiUv },
			{ name: "Ruff", icon: SiRuff },
			{ name: "Ty", icon: SiAstral },
			{ name: "pre-commit", icon: SiPrecommit },
			{ name: "Bun", icon: SiBun },
			{ name: "SonarQube", icon: SiSonar },
		],
		span: "wide",
	},
	{
		titleKey: "infrastructure",
		tools: [
			{ name: "Docker", icon: SiDocker },
			{ name: "Kubernetes", icon: SiKubernetes },
			{ name: "Ansible", icon: SiAnsible },
			{ name: "Terraform", icon: SiTerraform },
			{ name: "Jenkins", icon: SiJenkins },
			{ name: "Git", icon: SiGit },
			{ name: "GitHub Actions", icon: SiGithubactions },
		],
		span: "wide",
	},
	{
		titleKey: "cloud",
		tools: [
			{ name: "AWS", icon: FaAws },
			{ name: "Azure", icon: VscAzure },
		],
	},
	{
		titleKey: "dataML",
		tools: [
			{ name: "PyTorch", icon: SiPytorch },
			{ name: "Kafka", icon: SiApachekafka },
			{ name: "PySpark", icon: SiApachespark },
			{ name: "SQL", icon: SiMysql },
			{ name: "MLflow", icon: SiMlflow },
			{ name: "OpenSearch", icon: SiOpensearch },
			{ name: "QDrant", icon: FaDatabase },
		],
	},
	{
		titleKey: "observability",
		tools: [
			{ name: "Splunk", icon: SiSplunk },
			{ name: "Grafana", icon: SiGrafana },
			{ name: "CloudWatch", icon: FaAws },
		],
	},
	{
		titleKey: "web",
		tools: [
			{ name: "HTML5", icon: SiHtml5 },
			{ name: "CSS3", icon: FaCss3Alt },
			{ name: "React", icon: SiReact },
			{ name: "Node.js", icon: SiNodedotjs },
			{ name: "Next.js", icon: SiNextdotjs },
		],
	},
	{
		titleKey: "aiTooling",
		tools: [
			{ name: "Claude", icon: SiClaude },
			{ name: "GitHub Copilot", icon: VscCopilot },
			{ name: "AWS Bedrock", icon: FaAws },
			{ name: "GitHub Spec-Kit", icon: SiGithub },
			{ name: "LangChain", icon: SiLangchain },
			{ name: "Google ADK", icon: AiFillRobot },
		],
	},
];

interface SkillsSectionProps {
	className?: string;
}

export function SkillsSection({ className }: SkillsSectionProps) {
	const t = useTranslations("skills");

	return (
		<ContentSection maxWidth="5xl" heading={t("heading")} className={className}>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category, categoryIndex) => (
					<m.div
						key={category.titleKey}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{
							duration: 0.5,
							delay: categoryIndex * 0.1,
						}}
						className={`
              group relative rounded-lg border border-border
              bg-card p-4 transition-all duration-300
              hover:border-icons-primary
              hover:shadow-[0_0_20px_2px_color-mix(in_srgb,var(--icons-primary)_30%,transparent)]
              ${category.span === "wide" ? "lg:col-span-2" : ""}
            `}
					>
						<h3 className="text-sm font-semibold mb-3 text-foreground">
							{t(`categories.${category.titleKey}`)}
						</h3>
						<div className="flex flex-wrap gap-2">
							{category.tools.map((tool) => (
								<m.div
									key={tool.name}
									className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1.5
                    rounded-md border border-border/50
                    bg-background/50 backdrop-blur-sm
                    transition-all duration-200
                    ${tool.isDormant ? "opacity-40" : "hover:scale-105"}
                  `}
									whileHover={tool.isDormant ? {} : { scale: 1.05 }}
									transition={{ type: "spring", stiffness: 400, damping: 15 }}
								>
									<tool.icon
										className="w-4 h-4 shrink-0"
										style={{ color: "var(--icons-primary)" }}
									/>
									<span className="text-xs font-medium text-foreground whitespace-nowrap">
										{tool.name}
									</span>
									{tool.isDormant && (
										<span className="ml-1 px-1 py-0.5 text-[9px] font-medium bg-muted text-muted-foreground rounded">
											dormant
										</span>
									)}
								</m.div>
							))}
						</div>
					</m.div>
				))}
			</div>
		</ContentSection>
	);
}
