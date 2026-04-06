"use client";

import { Menu } from "@base-ui/react/menu";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { type Locale, locales } from "@/lib/i18n";

const localeNames: Record<Locale, string> = {
	en: "EN",
	it: "IT",
	de: "DE",
	fr: "FR",
};

export function LanguageSwitcher() {
	const pathname = usePathname();
	const currentLocale = pathname.split("/")[1] as Locale;

	return (
		<Menu.Root>
			<Menu.Trigger className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium text-(--icons-primary) hover:bg-(--theme-accent)/10 transition-colors cursor-pointer select-none">
				{localeNames[currentLocale] ?? "EN"}
				<ChevronDown className="w-3.5 h-3.5 opacity-50" />
			</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner align="end" sideOffset={8}>
					<Menu.Popup className="min-w-18 rounded-xl border border-(--theme-accent)/20 bg-background/95 backdrop-blur-md shadow-lg py-1 z-50 outline-none">
						{locales.map((locale) => (
							<Menu.LinkItem
								key={locale}
								href={`/${locale}`}
								className={`flex items-center justify-center px-3 py-1.5 text-sm transition-colors hover:bg-(--theme-accent)/10 outline-none cursor-pointer ${
									locale === currentLocale
										? "text-(--theme-accent) font-semibold"
										: "text-foreground"
								}`}
							>
								{localeNames[locale]}
							</Menu.LinkItem>
						))}
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
}
