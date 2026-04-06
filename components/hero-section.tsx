"use client";

import { useTheme } from "@wrksz/themes/client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
				<VideoText key={resolvedTheme} src={videoSrc} fontSize={10}>
					{t("title")}
				</VideoText>
			</div>

			<div>
				<p className="text-xl sm:text-2xl md:text-3xl text-foreground/80">{t("intro")}</p>
			</div>

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
