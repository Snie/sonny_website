"use client";

import { useTranslations } from "next-intl";
import { jsonTextToHtml } from "@/lib/text-utils";
import { ContentSection } from "@/components/ui/content-section";

export function AuthorNote() {
  const t = useTranslations("authorNote");

  return (
    <ContentSection maxWidth="4xl">
      <div className="bg-card border-l-4 border-primary p-6 rounded-r-lg shadow-lg">
        <div className="text-lg text-card-foreground italic leading-relaxed space-y-4">
          {jsonTextToHtml(t("text") as string)}
        </div>
      </div>
    </ContentSection>
  );
}
