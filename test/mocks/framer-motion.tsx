import React from "react";

const makeMotionProxy = () =>
	new Proxy(
		{},
		{
			get: (_target, prop: string) => {
				return React.forwardRef(
					(
						{
							initial: _initial,
							animate: _animate,
							exit: _exit,
							whileInView: _whileInView,
							whileHover: _whileHover,
							whileTap: _whileTap,
							viewport: _viewport,
							transition: _transition,
							variants: _variants,
							layout: _layout,
							layoutId: _layoutId,
							...props
						}: Record<string, unknown>,
						ref: React.Ref<HTMLElement>,
					) => {
						return React.createElement(prop, { ...props, ref });
					},
				);
			},
		},
	);

const motion = makeMotionProxy();
// 'm' is the lightweight alias used inside <LazyMotion> — same behaviour in tests
const m = makeMotionProxy();

// LazyMotion and domAnimation stubs — just render children
function LazyMotion({
	children,
}: {
	children: React.ReactNode;
	features: unknown;
	strict?: boolean;
}) {
	return <>{children}</>;
}
const domAnimation = {};

function AnimatePresence({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

const useAnimation = () => ({ start: () => {}, stop: () => {} });
const useInView = () => true;
const useScroll = () => ({
	scrollY: { get: () => 0, on: () => () => {} },
	scrollYProgress: { get: () => 0, on: () => () => {} },
});
const useTransform = () => ({ get: () => 0, on: () => () => {} });
const useMotionValue = () => ({
	get: () => 0,
	set: () => {},
	on: () => () => {},
});
const useMotionValueEvent = () => {};

export {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	m,
	motion,
	useAnimation,
	useInView,
	useMotionValue,
	useMotionValueEvent,
	useScroll,
	useTransform,
};
