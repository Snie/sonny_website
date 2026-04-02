"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@wrksz/themes/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { VideoText } from "@/components/ui/video-text";
import { HexGridBackground } from "./hex-grid-background";
import sonny from "../public/sonny_frontpage.webp"

export function HeroSection() {
  const t = useTranslations("hero");
  const { resolvedTheme } = useTheme();
  const [scrollOpacity, setScrollOpacity] = useState(1);

  // Theme-based video selection
  const videoSrc = resolvedTheme === "dark"
    ? "/frontpage_green.webm"
    : "/frontpage_blue.webm";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 0;
      const fadeEnd = 800; // Fade out over 400px of scroll

      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setScrollOpacity(opacity);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <HexGridBackground />
      <div
        className="h-50 w-full overflow-hidden"
        style={{ filter: 'drop-shadow(0 1.2px 1.2px var(--hero-glow))' }}
      >
        <VideoText
          key={resolvedTheme}
          src={videoSrc}
          children={t("title")}
          fontSize={10}
        ></VideoText>
      </div>

      <div>
        <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80">
          {t("intro")}
        </p>
      </div>

      {/* Fixed portrait in bottom-right corner */}
      <div
        className="fixed bottom-0 right-0 z-20 transition-opacity duration-100"
        style={{
          width: 'clamp(25vw, calc(50% - ((100vw - 400px) / 600) * 25%), 50%)',
          display: 'flex',
          flexDirection: 'column',
          opacity: scrollOpacity,
          pointerEvents: scrollOpacity === 0 ? 'none' : 'auto',
        }}
      >
        <Image
          alt="Sonny"
          loading="eager"
          src={sonny}
          sizes="(max-width: 400px) 50vw, (max-width: 1000px) 40vw, 25vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    </section>
  );
}
