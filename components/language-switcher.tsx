"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { locales, type Locale } from "@/lib/i18n";

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
            className="w-12"
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
