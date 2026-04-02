"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentSection } from "@/components/ui/content-section";

interface AcademicEntry {
  title: string;
  institution: string;
  city: string;
  period: string;
  description: string;
}

export function AcademicSection() {
  const t = useTranslations("academic");

  const entries: AcademicEntry[] = t.raw("entries");

  return (
    <ContentSection maxWidth="4xl" heading={t("heading")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl leading-tight">
                {entry.title}
              </CardTitle>
              <CardDescription>
                <div className="space-y-1 mt-2">
                  <div className="font-medium text-foreground/80">
                    {entry.institution}
                  </div>
                  <div className="text-sm">{entry.city}</div>
                  <div className="text-sm">{entry.period}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {entry.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ContentSection>
  );
}
