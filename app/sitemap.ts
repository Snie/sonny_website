import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	const languages = Object.fromEntries(SITE.locales.map((l) => [l, `${SITE.url}/${l}`]));

	return SITE.locales.map((locale) => ({
		url: `${SITE.url}/${locale}`,
		lastModified,
		changeFrequency: "monthly" as const,
		priority: locale === SITE.defaultLocale ? 1.0 : 0.9,
		alternates: { languages },
	}));
}
