import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE.name,
		short_name: "Sonny",
		description: "Portfolio of Sonny Monti — ML Tech Lead & Solution Architect",
		start_url: `/${SITE.defaultLocale}`,
		display: "standalone",
		background_color: "#ffffff",
		theme_color: SITE.accent,
		icons: [
			{ src: "/icon", sizes: "32x32", type: "image/png" },
			{ src: "/apple-icon", sizes: "180x180", type: "image/png" },
		],
	};
}
