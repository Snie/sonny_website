import { defaultLocale, locales } from "@/lib/i18n";

export const SITE = {
	url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonnymonti.com",
	name: "Sonny Monti",
	locales,
	defaultLocale,
	github: "https://github.com/Snie",
	linkedin: "https://www.linkedin.com/in/sonnymonti/",
	email: "montis@acm.org",
	// Green accent — matches --icons-primary in dark mode (terminal green).
	// TODO(visual): verify against the rendered theme with the user.
	accent: "#22c55e",
} as const;

export type SiteConfig = typeof SITE;
