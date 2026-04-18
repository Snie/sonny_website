import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/site-config";

const PORTRAIT_PATH = "/sonny_frontpage.webp";

export async function personSchema(locale: string) {
	const t = await getTranslations({ locale, namespace: "seo" });
	return {
		"@type": "Person",
		"@id": `${SITE.url}/#person`,
		name: SITE.name,
		url: `${SITE.url}/${locale}`,
		image: `${SITE.url}${PORTRAIT_PATH}`,
		sameAs: [SITE.github, SITE.linkedin],
		jobTitle: "ML Tech Lead & Solution Architect",
		worksFor: {
			"@type": "Organization",
			name: "Swiss Post",
			url: "https://www.post.ch/",
		},
		knowsAbout: [
			"Machine Learning",
			"MLOps",
			"Solution Architecture",
			"Platform Engineering",
			"AI Engineering",
			"Python",
		],
		description: t("description"),
		email: `mailto:${SITE.email}`,
	} as const;
}

export async function websiteSchema(locale: string) {
	const t = await getTranslations({ locale, namespace: "seo" });
	return {
		"@type": "WebSite",
		"@id": `${SITE.url}/#website`,
		url: SITE.url,
		name: SITE.name,
		description: t("description"),
		inLanguage: locale,
		publisher: { "@id": `${SITE.url}/#person` },
	} as const;
}

export async function profilePageSchema(locale: string) {
	const now = new Date().toISOString();
	return {
		"@type": "ProfilePage",
		"@id": `${SITE.url}/${locale}#profile`,
		url: `${SITE.url}/${locale}`,
		inLanguage: locale,
		mainEntity: { "@id": `${SITE.url}/#person` },
		dateCreated: "2026-01-01T00:00:00.000Z",
		dateModified: now,
	} as const;
}
