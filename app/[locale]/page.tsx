import dynamic from "next/dynamic";
import { HeroSection } from "@/components/hero-section";
import { locales } from "@/lib/i18n";

const AuthorNote = dynamic(() =>
	import("@/components/author-note").then((m) => ({ default: m.AuthorNote })),
);
const AboutSection = dynamic(() =>
	import("@/components/about-section").then((m) => ({ default: m.AboutSection })),
);
const SkillsSection = dynamic(() =>
	import("@/components/skills-section").then((m) => ({ default: m.SkillsSection })),
);
const Timeline = dynamic(() =>
	import("@/components/timeline").then((m) => ({ default: m.Timeline })),
);
const EducationSection = dynamic(() =>
	import("@/components/education-section").then((m) => ({ default: m.EducationSection })),
);
const AcademicSection = dynamic(() =>
	import("@/components/academic-section").then((m) => ({ default: m.AcademicSection })),
);
const LanguagesSection = dynamic(() =>
	import("@/components/languages-section").then((m) => ({ default: m.LanguagesSection })),
);
const ElsewhereSection = dynamic(() =>
	import("@/components/elsewhere-section").then((m) => ({ default: m.ElsewhereSection })),
);

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default function Home() {
	return (
		<main>
			<HeroSection />
			<AuthorNote />
			<AboutSection />
			<SkillsSection />
			<Timeline />
			<EducationSection />
			<AcademicSection />
			<LanguagesSection />
			<ElsewhereSection />
		</main>
	);
}
