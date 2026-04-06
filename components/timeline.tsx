"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ContentSection } from "@/components/ui/content-section";

interface TimelineEntry {
	role: string;
	company: string;
	city: string;
	period: string;
	description: string;
}

export function Timeline() {
	const t = useTranslations("experience");
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	// Get entries from translations
	const entries: TimelineEntry[] = t.raw("entries") as TimelineEntry[];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<ContentSection maxWidth="5xl" heading={t("heading")}>
			<motion.div
				className="relative"
				variants={prefersReducedMotion ? {} : containerVariants}
				initial={prefersReducedMotion ? "visible" : "hidden"}
				whileInView="visible"
				viewport={{ once: true, amount: 0.05 }}
			>
				{/* Vertical line */}
				<div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-border" />

				{entries.map((entry) => (
					<motion.div
						key={`${entry.company}-${entry.period}`}
						className="relative pl-8 md:pl-20 pb-12 last:pb-0"
						variants={prefersReducedMotion ? {} : itemVariants}
					>
						{/* Node circle */}
						<div className="absolute left-0 md:left-8 top-0 w-4 h-4 -ml-[7px] rounded-full bg-primary border-4 border-background" />

						{/* Content */}
						<div className="space-y-2">
							<h3 className="text-xl md:text-2xl font-semibold text-foreground">{entry.role}</h3>
							<div className="text-base md:text-lg text-foreground/70">
								<span className="font-medium">{entry.company}</span>
								{" · "}
								<span>{entry.city}</span>
							</div>
							<div className="text-sm md:text-base text-muted-foreground">{entry.period}</div>
							<p className="text-base text-foreground/80 pt-2 leading-relaxed">
								{entry.description}
							</p>
						</div>
					</motion.div>
				))}
			</motion.div>
		</ContentSection>
	);
}
