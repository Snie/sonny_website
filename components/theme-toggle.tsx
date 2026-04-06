"use client";

import { useTheme } from "@wrksz/themes/client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "system"] as const;
type Theme = (typeof themes)[number];

const labels: Record<Theme, string> = {
	light: "Light",
	dark: "Dark",
	system: "System",
};

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <span className="w-8 h-8 inline-block" aria-hidden="true" />;
	}

	const currentTheme = (theme as Theme) ?? "system";

	const cycleTheme = () => {
		const idx = themes.indexOf(currentTheme);
		setTheme(themes[(idx + 1) % themes.length]);
	};

	return (
		<button
			type="button"
			onClick={cycleTheme}
			title={`Theme: ${labels[currentTheme]} — click to cycle`}
			aria-label={`Theme: ${labels[currentTheme]}. Click to cycle.`}
			className="flex items-center justify-center w-8 h-8 rounded-full text-(--icons-primary) hover:bg-(--theme-accent)/10 transition-colors cursor-pointer"
		>
			{currentTheme === "light" && <Sun className="w-4 h-4" />}
			{currentTheme === "dark" && <Moon className="w-4 h-4" />}
			{currentTheme === "system" && <Monitor className="w-4 h-4" />}
		</button>
	);
}
