"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "@/components/ui/content-section";
import { type EducationEntry, getEntries } from "@/lib/i18n-content";

export function EducationSection() {
	const t = useTranslations("education");

	const entries = getEntries<EducationEntry>(t.raw("entries"), "education.entries");

	return (
		<ContentSection maxWidth="5xl" heading={t("heading")}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{entries.map((entry) => (
					<Card key={entry.degree} className="flex flex-col">
						<CardHeader>
							<CardTitle className="text-xl">{entry.degree}</CardTitle>
							<CardDescription>
								<div className="space-y-1 mt-2">
									<div className="font-medium text-foreground/80">{entry.institution}</div>
									<div className="text-sm">{entry.city}</div>
									<div className="text-sm">{entry.period}</div>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-1">
							<div className="space-y-2">
								<div>
									<span className="text-sm font-medium text-muted-foreground">Grade: </span>
									<span className="text-sm text-foreground">{entry.grade}</span>
								</div>
								<div>
									<span className="text-sm font-medium text-muted-foreground">
										Specialisation:{" "}
									</span>
									<span className="text-sm text-foreground">{entry.specialisation}</span>
								</div>
								<div>
									<span className="text-sm font-medium text-muted-foreground">Thesis: </span>
									<span className="text-sm text-foreground">{entry.thesis}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</ContentSection>
	);
}
