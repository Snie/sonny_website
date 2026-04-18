"use client";

import { useTheme } from "@wrksz/themes/client";
import { m } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SiGithub } from "react-icons/si";
import { VideoText } from "@/components/ui/video-text";
import sonny from "../public/sonny_frontpage.webp";
import { HexGridBackground } from "./hex-grid-background";

export function HeroSection() {
	const t = useTranslations("hero");
	const { resolvedTheme } = useTheme();
	const [scrollOpacity, setScrollOpacity] = useState(1);

	// Theme-based video selection
	const videoSrc = resolvedTheme === "dark" ? "/frontpage_green.webm" : "/frontpage_blue.webm";

	const ticking = useRef(false);

	useEffect(() => {
		const handleScroll = () => {
			if (ticking.current) return;
			ticking.current = true;
			requestAnimationFrame(() => {
				const scrollY = window.scrollY;
				const fadeEnd = 800;

				if (scrollY <= 0) {
					setScrollOpacity(1);
				} else if (scrollY >= fadeEnd) {
					setScrollOpacity(0);
				} else {
					setScrollOpacity(1 - scrollY / fadeEnd);
				}
				ticking.current = false;
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<section className="relative min-h-screen flex flex-col items-center justify-center px-4">
			<HexGridBackground />
			<div
				className="h-50 w-full overflow-hidden"
				style={{ filter: "drop-shadow(0 1.2px 1.2px var(--hero-glow))" }}
			>
				{/* fontSize uses clamp() — values are provisional pending visual inspection. */}
				<VideoText key={resolvedTheme} src={videoSrc} as="h1" fontSize="clamp(2.5rem, 11vw, 9rem)">
					{t("title")}
				</VideoText>
			</div>

			<div>
				<p className="text-xl sm:text-2xl md:text-3xl text-foreground/80">{t("intro")}</p>
			</div>

			<m.div
				className="flex items-center gap-5 mt-6"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
			>
				<a
					href="https://github.com/Snie"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
					className="text-2xl opacity-70 hover:opacity-100 transition-opacity duration-200"
					style={{ color: "var(--icons-primary)" }}
				>
					<SiGithub />
				</a>
				<a
					href="https://www.linkedin.com/in/sonnymonti/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"
					className="text-2xl opacity-70 hover:opacity-100 transition-opacity duration-200"
					style={{ color: "var(--icons-primary)" }}
				>
					<FaLinkedin />
				</a>
				<a
					href="mailto:montis@acm.org"
					aria-label="Email"
					className="text-2xl opacity-70 hover:opacity-100 transition-opacity duration-200"
					style={{ color: "var(--icons-primary)" }}
				>
					<MdEmail />
				</a>
			</m.div>

			{/* Fixed portrait in bottom-right corner */}
			<div
				className="fixed bottom-0 right-0 z-0 transition-opacity duration-100"
				style={{
					width: "clamp(25vw, calc(50% - ((100vw - 400px) / 600) * 25%), 50%)",
					display: "flex",
					flexDirection: "column",
					opacity: scrollOpacity,
					pointerEvents: scrollOpacity === 0 ? "none" : "auto",
				}}
			>
				<Image
					alt="Sonny"
					loading="eager"
					src={sonny}
					sizes="(max-width: 400px) 50vw, (max-width: 1000px) 40vw, 25vw"
					style={{
						width: "100%",
						height: "auto",
					}}
				/>
			</div>
		</section>
	);
}
