import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./lib/i18n";

export default createMiddleware({
	locales,
	defaultLocale,
	localePrefix: "always",
});

export const config = {
	// Match only internationalized pathnames
	matcher: ["/", "/(de|en|fr|it)/:path*"],
};
