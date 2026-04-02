import { HeroSection } from "@/components/hero-section";
import { AuthorNote } from "@/components/author-note";
import { AboutSection } from "@/components/about-section";
import { Timeline } from "@/components/timeline";
import { EducationSection } from "@/components/education-section";
import { AcademicSection } from "@/components/academic-section";
import { LanguagesSection } from "@/components/languages-section";
import { SkillsSection } from "@/components/skills-section";

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
    </main>
  );
}
