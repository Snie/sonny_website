export function jsonTextToHtml(text: string) {
	const paragraphs = text.split("\n").filter((p) => p.trim() !== "");

	return paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}
