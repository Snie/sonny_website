import type React from "react";

function MockLink({
	href,
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string;
}) {
	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
}

export default MockLink;
