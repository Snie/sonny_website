import { ThemeProvider } from "@wrksz/themes/next";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { locales } from "@/lib/i18n";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const notoSans = Noto_Sans({
	variable: "--font-noto-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;

	const titles: Record<string, string> = {
		en: "Sonny Monti — ML Tech Lead & Solution Architect",
		de: "Sonny Monti — ML Tech Lead & Solution Architect",
		fr: "Sonny Monti — ML Tech Lead & Solution Architect",
		it: "Sonny Monti — ML Tech Lead & Solution Architect",
	};

	const descriptions: Record<string, string> = {
		en: "ML Tech Lead at Swiss Post. Portfolio showcasing AI/ML engineering, MLOps, and platform architecture.",
		de: "ML Tech Lead bei der Schweizerischen Post. Portfolio mit KI/ML-Engineering, MLOps und Plattformarchitektur.",
		fr: "ML Tech Lead à la Poste Suisse. Portfolio présentant l'ingénierie IA/ML, MLOps et architecture de plateforme.",
		it: "ML Tech Lead alla Posta Svizzera. Portfolio di ingegneria IA/ML, MLOps e architettura di piattaforma.",
	};

	const title = titles[locale] ?? titles.en;
	const description = descriptions[locale] ?? descriptions.en;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			locale,
			type: "website",
			siteName: "Sonny Monti",
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
		alternates: {
			languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
		},
	};
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	const messages = await getMessages({ locale });

	return (
		<html
			lang={locale}
			className={`${notoSans.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<SpeedInsights />
			<Analytics />
			<body className="min-h-full flex flex-col font-sans">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<NextIntlClientProvider messages={messages}>
						{/* Fixed controls in top-right */}
						<div className="fixed top-4 right-4 z-50 flex gap-3">
							<LanguageSwitcher />
							<ThemeToggle />
						</div>
						{children}
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
