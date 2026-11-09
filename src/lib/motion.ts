import Lenis from 'lenis';

/**
 * Inertial smooth scrolling for the whole page. Nav links (#projects…) glide to their section.
 * `autoToggle` pauses it while <html> has overflow hidden (the logo intro locks scrolling).
 * Lenis honours prefers-reduced-motion on its own (plain native scrolling).
 *
 * Safari keeps its own wheel/trackpad scrolling: it runs JS animation at 60fps even on 120Hz
 * screens, so Lenis-driven scrolling there is visibly choppier than Safari's native scrolling,
 * which already has smooth momentum. The nav-link glide still uses Lenis everywhere.
 */
export function startSmoothScroll(): () => void {
	const lenis = new Lenis({
		autoRaf: true,
		smoothWheel: !isSafari(),
		autoToggle: true,
		anchors: { duration: 1.6 },
		stopInertiaOnNavigate: true,
		lerp: 0.085
	});
	return () => lenis.destroy();
}

function isSafari() {
	const ua = navigator.userAgent;
	return /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Android/.test(ua);
}

type ScrollVarsOptions = {
	/** CSS variable for "how far this element has scrolled off the top" (0 → 1). */
	leave?: string;
	/** CSS variable for "how far this element has travelled through the viewport" (0 → 1). */
	pass?: string;
};

/**
 * Svelte action: keeps scroll-progress CSS variables on an element up to date, so CSS can
 * drive scroll-linked motion (parallax, drift, slide). Only a fallback for browsers without
 * CSS scroll-driven animations (animation-timeline), which do the same work in step with
 * the scroll.
 */
export function scrollVars(node: HTMLElement, options: ScrollVarsOptions = {}) {
	// Browsers with scroll-driven animations run this motion in CSS instead (see the components).
	if (CSS.supports('animation-timeline: view()')) return;

	const leaveVar = options.leave ?? '--leave';
	const passVar = options.pass ?? '--pass';
	let frame = 0;

	const update = () => {
		frame = 0;
		const r = node.getBoundingClientRect();
		const vh = window.innerHeight;
		const leave = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
		const pass = Math.min(1, Math.max(0, (vh - r.top) / Math.max(1, vh + r.height)));
		node.style.setProperty(leaveVar, leave.toFixed(4));
		node.style.setProperty(passVar, pass.toFixed(4));
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};

	update();
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);
	return {
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		}
	};
}

/**
 * Svelte action: adds the `shown` class once the element scrolls into view, so its
 * entrance animation plays as you reach it rather than on page load.
 */
export function revealOnScroll(node: HTMLElement, threshold = 0.15) {
	const io = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('shown');
				io.disconnect();
			}
		},
		{ threshold }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}

let scrollLocks = 0;

/**
 * Stops the page from scrolling (Lenis pauses itself while <html> has overflow hidden) until the
 * returned function is called. Counted, so the intro and the project sheet can't unlock each
 * other; calling the returned function more than once is harmless.
 */
export function lockScroll(): () => void {
	if (scrollLocks++ === 0) document.documentElement.style.overflow = 'hidden';
	let released = false;
	return () => {
		if (released) return;
		released = true;
		if (--scrollLocks === 0) document.documentElement.style.overflow = '';
	};
}

/** Whether the visitor asked for reduced motion. */
export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
