import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				background: SITE.accent,
				color: "#ffffff",
				fontSize: 18,
				fontWeight: 700,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				letterSpacing: "-0.04em",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			SM
		</div>,
		size,
	);
}
