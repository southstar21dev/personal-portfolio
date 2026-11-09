<script lang="ts">
	import type { ScreenGroup, Slug } from '#lib/projects.js';
	import { screen } from '#lib/project-screens.js';
	import { imageLoading } from '#lib/image-loading.js';
	import { prefersReducedMotion } from '#lib/motion.js';

	// One labelled row of screenshots in the project sheet, scrolled sideways with ‹ › buttons
	// that are disabled at either end.
	interface Props {
		slug: Slug;
		/** The project's name, for the screenshots' alt text. */
		name: string;
		group: ScreenGroup;
	}

	let { slug, name, group }: Props = $props();

	const tilts = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.2];

	/**
	 * Width of a non-phone screenshot: at most 560px wide and 360px tall, and never larger than
	 * the screenshot itself (they are 2x captures), so a tall popover or a small banner doesn't
	 * blow up beside the website screenshots.
	 */
	const wideWidth = (w: number, h: number) => Math.round(Math.min(560, (360 * w) / h, w / 2));

	const items = $derived(
		group.items.map((item) => {
			const pic = screen(slug, item.name);
			const phone = pic.img.w / pic.img.h < 0.8;
			return { ...item, pic, phone, width: phone ? 230 : wideWidth(pic.img.w, pic.img.h) };
		})
	);

	let row: HTMLElement | undefined = $state();
	let canBack = $state(false);
	let canForward = $state(false);

	function measure(el: HTMLElement) {
		const max = el.scrollWidth - el.clientWidth;
		canBack = el.scrollLeft > 4;
		canForward = el.scrollLeft < max - 4;
	}

	/**
	 * Wheel and trackpad over the row. Safari ties a whole trackpad gesture to the element it
	 * starts on, so a mostly vertical swipe that begins over a row (which can only scroll sideways)
	 * would leave the sheet stuck. Vertical intent therefore scrolls the sheet; sideways intent
	 * scrolls the row, and is swallowed at either end so it can't turn into the browser's
	 * swipe-back.
	 */
	function onwheel(this: HTMLElement, e: WheelEvent) {
		if (e.ctrlKey) return; // pinch-zoom
		const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
		if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
			const sheet = this.closest('dialog');
			if (!e.deltaY || !sheet) return;
			e.preventDefault();
			sheet.scrollTop += e.deltaY * unit;
			return;
		}
		const max = this.scrollWidth - this.clientWidth;
		if ((e.deltaX < 0 && this.scrollLeft <= 0) || (e.deltaX > 0 && this.scrollLeft >= max - 1)) {
			e.preventDefault();
		}
	}

	/** Svelte action for the row: keeps the buttons' enabled state in step with its scroll. */
	function strip(el: HTMLElement) {
		let frame = 0;
		const update = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => measure(el));
		};
		update();
		el.addEventListener('scroll', update, { passive: true });
		el.addEventListener('wheel', onwheel, { passive: false });
		// Lazy images widen the row as they load.
		const ro = new ResizeObserver(update);
		ro.observe(el);
		for (const child of el.children) ro.observe(child);
		return {
			destroy() {
				cancelAnimationFrame(frame);
				el.removeEventListener('scroll', update);
				el.removeEventListener('wheel', onwheel);
				ro.disconnect();
			}
		};
	}

	/** Scroll by most of the visible width, so one card stays in view for context. */
	function page(dir: 1 | -1) {
		const el = row;
		if (!el) return;
		// Land on a card's left edge rather than halfway through one.
		const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
		const goal = el.scrollLeft + dir * Math.max(240, el.clientWidth * 0.8);
		const starts = [...el.children].map((c) => (c as HTMLElement).offsetLeft - pad);
		const candidates = starts.filter((s) =>
			dir > 0 ? s > el.scrollLeft + 4 : s < el.scrollLeft - 4
		);
		const left = candidates.length
			? candidates.reduce((a, b) => (Math.abs(b - goal) < Math.abs(a - goal) ? b : a))
			: goal;
		el.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	}
</script>

<div class="group">
	<div class="group-head">
		<h4>{group.label}</h4>
		<div class="ctls">
			<button
				class="ctl"
				type="button"
				aria-label="Scroll {group.label} screenshots back"
				disabled={!canBack}
				onclick={() => page(-1)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
			</button>
			<button
				class="ctl"
				type="button"
				aria-label="Scroll {group.label} screenshots forward"
				disabled={!canForward}
				onclick={() => page(1)}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
			</button>
		</div>
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be focusable for keyboard users) -->
	<div
		class="strip"
		tabindex="0"
		role="region"
		aria-label="{group.label} screenshots"
		bind:this={row}
		use:strip
	>
		{#each items as item, i (item.name)}
			<figure class:phone={item.phone} style:--w="{item.width}px">
				<div class="shot img-load" style:--r="{tilts[i % tilts.length]}deg" use:imageLoading>
					<enhanced:img
						src={item.pic}
						alt="{name}: {item.caption}"
						sizes={item.phone ? '230px' : `(min-width: 700px) ${item.width}px, 80vw`}
						loading="lazy"
						decoding="async"
						draggable="false"
					/>
				</div>
				<figcaption>{item.caption}</figcaption>
			</figure>
		{/each}
	</div>
</div>

<style>
	.group {
		margin-top: 40px;
	}

	.group-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.ctls {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	h4 {
		margin: 0;
		font-size: 28px;
		font-weight: 850;
		font-stretch: 76%;
		letter-spacing: 0.01em;
		color: var(--muted);
	}

	.strip {
		/* The cards' offsetLeft is measured from the row (see page()). */
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 36px;
		margin: 0 calc(var(--gutter) * -1);
		padding: 32px var(--gutter) 40px;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
	}

	.strip:focus-visible {
		outline-offset: -4px;
	}

	figure {
		flex: none;
		width: min(var(--w, 560px), 80vw);
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	figure.phone {
		width: 230px;
	}

	figcaption {
		padding-left: 4px;
		font-size: 14px;
		font-weight: 600;
		color: var(--muted);
	}

	/* (No lift on hover here: inside a scrolling row a growing card changes what the row has to
	   scroll, which makes the row jump under the pointer.) */

	@media (max-width: 560px) {
		.group {
			margin-top: 28px;
		}

		h4 {
			font-size: 24px;
		}

		.strip {
			gap: 20px;
			padding: 24px var(--gutter) 32px;
		}

		figure.phone {
			width: 200px;
		}
	}
</style>
