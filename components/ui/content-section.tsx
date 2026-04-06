import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
	children: ReactNode;
	className?: string;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
	heading?: string;
	headingClassName?: string;
}

const maxWidthMap = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
	"4xl": "max-w-4xl",
	"5xl": "max-w-5xl",
};

export function ContentSection({
	children,
	className,
	maxWidth = "4xl",
	heading,
	headingClassName,
}: ContentSectionProps) {
	return (
		<section className={cn(maxWidthMap[maxWidth], "mx-auto px-4 py-16", className)}>
			{heading && (
				<h2
					className={cn("text-3xl md:text-4xl font-bold mb-12 text-foreground", headingClassName)}
				>
					{heading}
				</h2>
			)}
			{children}
		</section>
	);
}
