export const Menu = {
	Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	Trigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<button type="button" className={className}>
			{children}
		</button>
	),
	Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	Positioner: ({
		children,
	}: {
		children: React.ReactNode;
		align?: string;
		sideOffset?: number;
	}) => <>{children}</>,
	Popup: ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<div className={className}>{children}</div>
	),
	LinkItem: ({
		href,
		children,
		className,
	}: {
		href: string;
		children: React.ReactNode;
		className?: string;
	}) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
};
