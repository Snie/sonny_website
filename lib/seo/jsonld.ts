import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/site-config";

const PORTRAIT_PATH = "/sonny_frontpage.webp";

// JS line separators that are valid in JSON but terminate strings inside an
// inline <script>. Built from char codes so the raw characters never appear in
// source (a literal one breaks the regex parser).
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Serialize a JSON-LD object for embedding in an inline `<script>` tag.
 *
 * Escapes the characters that could otherwise break out of the script context
 * (`<`, `>`, `&`) plus U+2028/U+2029. All current inputs are trusted (site
 * config + own translations), so this is defense-in-depth that keeps the sink
 * safe if untrusted data is ever added.
 */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026")
		.split(LINE_SEPARATOR)
		.join("\\u2028")
		.split(PARAGRAPH_SEPARATOR)
		.join("\\u2029");
}

export async function personSchema(locale: string) {
	const t = await getTranslations({ locale, namespace: "seo" });
	return {
		"@type": "Person",
		"@id": `${SITE.url}/#person`,
		name: SITE.name,
		url: `${SITE.url}/${locale}`,
		image: `${SITE.url}${PORTRAIT_PATH}`,
		sameAs: [SITE.github, SITE.linkedin],
		jobTitle: "AI Solution Architect",
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
