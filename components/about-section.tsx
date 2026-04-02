"use client";

import { useTranslations } from "next-intl";
import { jsonTextToHtml } from "@/lib/text-utils";
import { ContentSection } from "@/components/ui/content-section";

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <ContentSection maxWidth="4xl" heading={t("heading")} headingClassName="mb-6">
      <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
        {jsonTextToHtml(t("text") as string)}
      </div>
    </ContentSection>
  );
}
