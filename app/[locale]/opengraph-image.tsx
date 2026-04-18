import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { locales } from "@/lib/i18n";
import { SITE } from "@/lib/site-config";

export const alt = "Sonny Monti — ML Tech Lead & Solution Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "seo" });

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: 80,
				background: `linear-gradient(135deg, #0a0a0a 0%, #0a0a0a 60%, ${SITE.accent}33 100%)`,
				color: "#ffffff",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
				<div
					style={{
						width: 56,
						height: 56,
						background: SITE.accent,
						color: "#ffffff",
						fontSize: 28,
						fontWeight: 700,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 12,
						letterSpacing: "-0.04em",
					}}
				>
					SM
				</div>
				<span style={{ fontSize: 24, opacity: 0.7 }}>{SITE.url.replace("https://", "")}</span>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
				<h1
					style={{
						fontSize: 72,
						fontWeight: 700,
						lineHeight: 1.05,
						letterSpacing: "-0.03em",
						margin: 0,
					}}
				>
					{SITE.name}
				</h1>
				<p
					style={{
						fontSize: 36,
						lineHeight: 1.3,
						margin: 0,
						color: SITE.accent,
						fontWeight: 600,
					}}
				>
					{t("ogTagline")}
				</p>
			</div>
		</div>,
		size,
	);
}
