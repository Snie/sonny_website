import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@wrksz/themes/next";
import { domAnimation, LazyMotion } from "framer-motion";
import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { personSchema, websiteSchema } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/site-config";
import "../globals.css";

const notoSans = Noto_Sans({
	variable: "--font-noto-sans",
	subsets: ["latin"],
	weight: ["400", "600"],
	display: "swap",
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "seo" });
	const title = t("title");
	const description = t("description");

	return {
		metadataBase: new URL(SITE.url),
		title: { default: title, template: `%s — ${SITE.name}` },
		description,
		openGraph: {
			title,
			description,
			locale,
			type: "website",
			siteName: SITE.name,
			images: [
				{
					url: `/${locale}/opengraph-image`,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`/${locale}/twitter-image`],
		},
		alternates: {
			canonical: `/${locale}`,
			languages: {
				...Object.fromEntries(SITE.locales.map((l) => [l, `/${l}`])),
				"x-default": "/en",
			},
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		icons: {
			icon: "/icon",
			apple: "/apple-icon",
		},
		manifest: "/manifest.webmanifest",
		verification: {
			google: process.env.GOOGLE_SITE_VERIFICATION,
		},
	};
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: SITE.accent },
	],
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	const messages = await getMessages({ locale });

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [await personSchema(locale), await websiteSchema(locale)],
	};

	return (
		<html
			lang={locale}
			className={`${notoSans.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<SpeedInsights />
			<Analytics />
			<body className="min-h-full flex flex-col font-sans">
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<LazyMotion features={domAnimation} strict>
						<NextIntlClientProvider messages={messages}>
							<header className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border border-border/50 bg-background/80 backdrop-blur-md shadow-sm px-2 py-1">
								<nav aria-label="Site navigation" className="flex items-center gap-1">
									<LanguageSwitcher />
									<span className="w-px h-4 bg-border/60" aria-hidden="true" />
									<ThemeToggle />
								</nav>
							</header>
							{children}
							<footer className="mt-auto border-t border-border/40 py-6 px-4 text-center text-sm text-foreground/60">
								<div className="flex flex-col items-center gap-3">
									<nav aria-label="Footer links" className="flex items-center gap-4">
										<a
											href={SITE.github}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-foreground transition-colors"
										>
											GitHub
										</a>
										<a
											href={SITE.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-foreground transition-colors"
										>
											LinkedIn
										</a>
										<a
											href={`mailto:${SITE.email}`}
											className="hover:text-foreground transition-colors"
										>
											Email
										</a>
									</nav>
									<p>
										© {new Date().getFullYear()} {SITE.name}
									</p>
								</div>
							</footer>
						</NextIntlClientProvider>
					</LazyMotion>
				</ThemeProvider>
			</body>
		</html>
	);
}
