"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type Locale, locales } from "@/lib/i18n";

const localeNames: Record<Locale, string> = {
	en: "EN",
	it: "IT",
	de: "DE",
	fr: "FR",
};

export function LanguageSwitcher() {
	const pathname = usePathname();

	// Extract current locale from pathname
	const currentLocale = pathname.split("/")[1] as Locale;

	return (
		<div className="flex gap-2">
			{locales.map((locale) => (
				<Link key={locale} href={`/${locale}`}>
					<Button
						variant={locale === currentLocale ? "default" : "outline"}
						size="sm"
						className={
							locale === currentLocale
								? "w-12 bg-[var(--theme-accent)] text-black border-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/80 hover:text-black"
								: "w-12 !border-[var(--theme-accent)] text-foreground hover:bg-[var(--theme-accent)]/10"
						}
						aria-label={`Switch to ${localeNames[locale]}`}
						aria-current={locale === currentLocale ? "true" : undefined}
					>
						{localeNames[locale]}
					</Button>
				</Link>
			))}
		</div>
	);
}
