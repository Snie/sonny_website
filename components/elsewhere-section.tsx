"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { GiGrapes, GiSwissArmyKnife } from "react-icons/gi";
import { IoMusicalNotes } from "react-icons/io5";
import { MdSportsTennis } from "react-icons/md";
import { SiAcm } from "react-icons/si";
import { TbSnowboarding } from "react-icons/tb";
import { ContentSection } from "@/components/ui/content-section";
import { cn } from "@/lib/utils";

interface ElsewhereCardProps {
	title: string;
	body: string;
	icon?: React.ReactNode;
	icons?: React.ReactNode[];
	imageSrc?: string;
	imageAlt?: string;
	link?: string;
	className?: string;
	index: number;
}

function ElsewhereCard({
	title,
	body,
	icon,
	icons,
	imageSrc,
	imageAlt,
	link,
	className,
	index,
}: ElsewhereCardProps) {
	const [imageError, setImageError] = useState(false);

	const cardContent = (
		<>
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-3">
					{imageSrc && !imageError ? (
						<div className="relative w-10 h-10 shrink-0">
							<Image
								src={imageSrc}
								alt={imageAlt ?? title}
								fill
								sizes="40px"
								className="object-contain invert dark:invert-0"
								onError={() => setImageError(true)}
							/>
						</div>
					) : icons ? (
						<div className="flex gap-2">
							{icons.map((ic, i) => {
								return (
									<span key={i} className="text-3xl" style={{ color: "var(--icons-primary)" }}>
										{ic}
									</span>
								);
							})}
						</div>
					) : (
						<span className="text-3xl" style={{ color: "var(--icons-primary)" }}>
							{icon}
						</span>
					)}
				</div>
				{link && (
					<ExternalLink
						className="w-4 h-4 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
						style={{ color: "var(--icons-primary)" }}
					/>
				)}
			</div>
			<div className="space-y-2">
				<h3 className="text-lg font-semibold text-foreground">{title}</h3>
				<p className="text-sm text-foreground/80 leading-relaxed">{body}</p>
			</div>
		</>
	);

	const containerClasses = cn(
		"group relative flex flex-col gap-4 p-6 rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-all duration-300",
		link && "cursor-pointer hover:ring-2 hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.3)]",
		className,
	);

	const motionProps = {
		initial: { opacity: 0, y: 20 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, margin: "-100px" },
		transition: {
			duration: 0.5,
			delay: index * 0.1,
			ease: [0.21, 0.47, 0.32, 0.98] as const,
		},
	} as const;

	if (link) {
		return (
			<motion.a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				className={containerClasses}
				{...motionProps}
			>
				{cardContent}
			</motion.a>
		);
	}

	return (
		<motion.div className={containerClasses} {...motionProps}>
			{cardContent}
		</motion.div>
	);
}

export function ElsewhereSection({ className }: { className?: string }) {
	const t = useTranslations("elsewhere");

	return (
		<ContentSection maxWidth="5xl" heading={t("heading")} className={className}>
			{/* Desktop: Asymmetric bento grid */}
			<div className="hidden md:grid grid-cols-6 gap-6">
				{/* Row 1: ACM (small) · Swiss Army (medium) · Cantina Monti (medium) */}
				<ElsewhereCard
					title={t("acm.title")}
					body={t("acm.body")}
					icon={<SiAcm />}
					link="/acm_membership.pdf"
					className="col-span-2"
					index={0}
				/>
				<ElsewhereCard
					title={t("army.title")}
					body={t("army.body")}
					icon={<GiSwissArmyKnife />}
					className="col-span-2"
					index={1}
				/>
				<ElsewhereCard
					title={t("cantina.title")}
					body={t("cantina.body")}
					imageSrc="/logo_cantina.png"
					imageAlt="Cantina Monti"
					icon={<GiGrapes />}
					link="https://cantinamonti.ch/"
					className="col-span-2"
					index={2}
				/>

				{/* Row 2: Music & Gaming (wide) · Tennis & Snowboard (medium) */}
				<ElsewhereCard
					title={t("gaming.title")}
					body={t("gaming.body")}
					icons={[<FaXbox key="xbox" />, <FaPlaystation key="ps" />, <IoMusicalNotes key="mpf" />]}
					className="col-span-4"
					index={3}
				/>
				<ElsewhereCard
					title={t("sport.title")}
					body={t("sport.body")}
					icons={[<TbSnowboarding key="snow" />, <MdSportsTennis key="tennis" />]}
					className="col-span-2"
					index={4}
				/>
			</div>

			{/* Mobile: Single column */}
			<div className="md:hidden flex flex-col gap-6">
				<ElsewhereCard
					title={t("acm.title")}
					body={t("acm.body")}
					icon={<SiAcm />}
					link="/acm_membership.pdf"
					index={0}
				/>
				<ElsewhereCard
					title={t("army.title")}
					body={t("army.body")}
					icon={<GiSwissArmyKnife />}
					index={1}
				/>
				<ElsewhereCard
					title={t("cantina.title")}
					body={t("cantina.body")}
					imageSrc="/logo_cantina.png"
					imageAlt="Cantina Monti"
					icon={<GiGrapes />}
					link="https://cantinamonti.ch/"
					index={2}
				/>
				<ElsewhereCard
					title={t("gaming.title")}
					body={t("gaming.body")}
					icons={[<FaXbox key="xbox" />, <FaPlaystation key="ps" />, <IoMusicalNotes key="mpf" />]}
					index={3}
				/>
				<ElsewhereCard
					title={t("sport.title")}
					body={t("sport.body")}
					icons={[<TbSnowboarding key="snow" />, <MdSportsTennis key="tennis" />]}
					index={4}
				/>
			</div>
		</ContentSection>
	);
}
