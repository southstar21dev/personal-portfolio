<script lang="ts">
	import { untrack } from 'svelte';
	import { projects, type Project, type Slug } from '#lib/projects.js';
	import { icons } from '#lib/projects-media.js';
	import { preloadProject } from '#lib/project-screens.js';
	import { imageLoading } from '#lib/image-loading.js';
	import { lockScroll, prefersReducedMotion } from '#lib/motion.js';
	import HeroFan from './HeroFan.svelte';
	import ScreenStrip from './ScreenStrip.svelte';
	import ProjectPager from './ProjectPager.svelte';

	// A project's full page, as a sheet over the home page. ProjectsSection loads it on demand.
	interface Props {
		/** The open project, or null when closed. */
		project: Project | null;
		onclose: () => void;
		onnavigate: (slug: Slug) => void;
	}

	let { project, onclose, onnavigate }: Props = $props();

	/** How long the sheet takes to slide out (the CSS reads it as --close-ms). */
	const CLOSE_MS = 320;

	let dialog: HTMLDialogElement | undefined = $state();
	let closing = $state(false);
	// What `project` was before the last change, so the sheet can keep showing it while it slides out.
	let shown: Project | null = $state(null);
	let unlock: (() => void) | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		const el = dialog;
		const next = project;
		if (!el) return;
		// Only `project` (and the element) drive this; the rest is bookkeeping it reads and writes.
		untrack(() => {
			if (next) {
				clearTimeout(closeTimer);
				closing = false;
				if (shown && shown.slug !== next.slug) el.scrollTo({ top: 0 });
				shown = next;
				if (!el.open) {
					el.showModal();
					el.scrollTo({ top: 0 });
					// The page behind stays put.
					unlock ??= lockScroll();
				}
			} else if (el.open && !closing) {
				closing = true;
				const finish = () => {
					el.close();
					unlock?.();
					unlock = undefined;
					closing = false;
					shown = null;
				};
				if (prefersReducedMotion()) finish();
				else closeTimer = setTimeout(finish, CLOSE_MS);
			}
		});
	});

	// Never leave a timer running or the page locked if the component goes away while open.
	$effect(() => () => {
		clearTimeout(closeTimer);
		unlock?.();
	});

	const index = $derived(shown ? projects.findIndex((p) => p.slug === shown!.slug) : 0);
	const next = $derived(projects[(index + 1) % projects.length]);
	const prev = $derived(projects[(index - 1 + projects.length) % projects.length]);
	const pad = (n: number) => String(n).padStart(2, '0');

	// Flipping to the neighbours should be instant: start on their screenshots now.
	$effect(() => {
		if (!shown) return;
		preloadProject(next);
		preloadProject(prev);
	});

	function oncancel(e: Event) {
		// Esc: animate out through the same path as the close button.
		e.preventDefault();
		onclose();
	}

	function onclick(e: MouseEvent) {
		// A click on the dimmed strip above the sheet closes it.
		if (e.target === dialog) onclose();
	}
</script>

<dialog
	bind:this={dialog}
	class="detail"
	class:closing
	aria-labelledby="detail-title"
	data-lenis-prevent
	style:--close-ms="{CLOSE_MS}ms"
	{oncancel}
	{onclick}
>
	{#if shown}
		{@const p = shown}
		{#key p.slug}
			<article class="sheet">
				<div class="ghost-word watermark" aria-hidden="true">
					{p.name.split(' ')[0].toUpperCase()}
				</div>

				<div class="inner">
					<div class="bar">
						<button class="ctl back" type="button" onclick={onclose}>
							<span aria-hidden="true">←</span> All projects
						</button>
						<div class="ctls">
							<span class="pos">{pad(index + 1)} / {pad(projects.length)}</span>
							<button
								class="ctl"
								type="button"
								aria-label="Previous project: {prev.name}"
								onclick={() => onnavigate(prev.slug)}
							>
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
							</button>
							<button
								class="ctl"
								type="button"
								aria-label="Next project: {next.name}"
								onclick={() => onnavigate(next.slug)}
							>
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
							</button>
							<button class="ctl" type="button" aria-label="Close" onclick={onclose}>
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
							</button>
						</div>
					</div>

					<header class="hero">
						<div class="words">
							<img
								class="app-icon img-fade"
								src={icons[p.slug]}
								alt=""
								width="72"
								height="72"
								use:imageLoading
							/>
							<h2 id="detail-title" class="display">{p.name.toUpperCase()}</h2>
							<p class="meta">
								<span>{p.platform}</span>
								<span class="status" class:shipped={p.status === 'Shipped'}>{p.status}</span>
							</p>
							<p class="tagline">{p.summary}</p>
							<p class="about">{p.about}</p>
							<div class="links">
								{#each p.links as link (link.href)}
									<a class="out" href={link.href} target="_blank" rel="noopener noreferrer">
										{link.label} <span aria-hidden="true">↗</span>
									</a>
								{/each}
							</div>
						</div>

						<HeroFan project={p} />
					</header>

					<section class="block" aria-labelledby="detail-screens">
						<h3 id="detail-screens" class="display">SCREENS</h3>
						{#each p.screens as group (group.label)}
							<ScreenStrip slug={p.slug} name={p.name} {group} />
						{/each}
					</section>

					<section class="block" aria-labelledby="detail-features">
						<h3 id="detail-features" class="display">WHAT IT DOES</h3>
						<div class="features">
							{#each p.features as feature, i (feature.title)}
								<div class="feature">
									<span class="num" aria-hidden="true">{pad(i + 1)}</span>
									<div>
										<h4>{feature.title}</h4>
										<p>{feature.text}</p>
									</div>
								</div>
							{/each}
						</div>
					</section>

					<section class="block stack" aria-labelledby="detail-stack">
						<h3 id="detail-stack" class="display">BUILT WITH</h3>
						<p>{p.stack.join(' · ')}</p>
					</section>

					<ProjectPager {prev} {next} {onnavigate} />
				</div>
			</article>
		{/key}
	{/if}
</dialog>

<style>
	.detail {
		position: fixed;
		inset: 0;
		width: 100%;
		max-width: none;
		height: 100dvh;
		max-height: none;
		margin: 0;
		padding: 28px 0 0;
		border: 0;
		background: transparent;
		overflow-y: auto;
		overscroll-behavior: contain;
		/* Scrolls like the page: no visible scrollbar */
		scrollbar-width: none;
		color: var(--ink);
	}

	.detail::-webkit-scrollbar {
		display: none;
	}

	.detail::backdrop {
		/* A plain dim, not a blur: Safari re-blurs the page behind on every frame of scrolling. */
		background: color-mix(in srgb, var(--ink) 50%, transparent);
		animation: fade-in 0.4s ease both;
	}

	.detail.closing::backdrop {
		animation: fade-out var(--close-ms) ease both;
	}

	.sheet {
		position: relative;
		max-width: 1400px;
		min-height: calc(100dvh - 28px);
		margin: 0 auto;
		overflow: hidden;
		background: var(--bg);
		border-radius: 28px 28px 0 0;
		/* 1. A soft shadow cast upward onto the dimmed page.
		   2. A solid white copy of the sheet 100vh lower, hidden behind it: when Safari's rubber band
		      overshoots past the end, the gap below shows white instead of the dimmed page. A shadow
		      moves with the sheet and doesn't add to the scroll length. */
		box-shadow:
			0 -24px 60px -20px color-mix(in srgb, var(--ink) 22%, transparent),
			0 100vh 0 0 var(--bg);
		animation: sheet-in 0.7s var(--ease-out) both;
	}

	.closing .sheet {
		animation: sheet-out var(--close-ms) var(--ease-in-out) both;
	}

	.watermark {
		top: 96px;
		right: -1vw;
		font-size: 19vw;
		white-space: nowrap;
	}

	.inner {
		position: relative;
		padding: 0 var(--gutter);
	}

	/* ---------- top bar ---------- */

	.bar {
		position: relative;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		padding: 20px 0;
	}

	.ctls {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.pos {
		padding-right: 8px;
		font-size: 15px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}

	.ctl.back {
		padding-left: 6px;
	}

	/* ---------- hero ---------- */

	.hero {
		position: relative;
		display: grid;
		grid-template-columns: 5fr 6fr;
		gap: 48px;
		align-items: start;
		padding-top: 40px;
	}

	.words {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		padding-top: 24px;
	}

	.app-icon {
		width: 72px;
		height: 72px;
		border-radius: 18px;
		transform: rotate(-6deg);
		box-shadow: var(--shadow-icon);
	}

	h2 {
		font-size: clamp(56px, 8.4vw, 132px);
	}

	.meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 14px;
		font-size: 15px;
		font-weight: 600;
		color: var(--muted);
	}

	.tagline {
		margin: 0;
		max-width: 30ch;
		font-size: clamp(20px, 2vw, 26px);
		line-height: 1.3;
		font-weight: 650;
		color: var(--black);
	}

	.about {
		margin: 0;
		max-width: 52ch;
		font-size: 17px;
		line-height: 1.6;
		color: var(--muted);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 36px;
		margin-top: 8px;
	}

	.out {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--black);
	}

	.out:hover {
		color: var(--muted);
	}

	/* ---------- sections ---------- */

	.block {
		margin-top: 96px;
		padding-top: 40px;
		border-top: 1px solid var(--line);
	}

	h3 {
		font-size: clamp(44px, 6vw, 88px);
	}

	.features {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px 64px;
		margin-top: 48px;
	}

	.feature {
		display: grid;
		grid-template-columns: 88px 1fr;
		gap: 20px;
		align-items: start;
	}

	.num {
		font-size: 76px;
		font-weight: 900;
		font-stretch: 76%;
		line-height: 0.8;
		color: var(--faint);
	}

	.feature h4 {
		margin: 0 0 8px;
		font-size: 22px;
		font-weight: 800;
		font-stretch: 85%;
		color: var(--black);
	}

	.feature p {
		margin: 0;
		max-width: 46ch;
		font-size: 16px;
		line-height: 1.6;
		color: var(--muted);
	}

	.stack {
		display: grid;
		grid-template-columns: minmax(0, 320px) 1fr;
		gap: 24px 48px;
	}

	.stack p {
		margin: 0;
		align-self: end;
		font-size: clamp(20px, 2vw, 26px);
		line-height: 1.5;
		font-weight: 650;
		color: var(--black);
	}

	/* ---------- motion ---------- */

	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(80px);
		}
	}

	@keyframes sheet-out {
		to {
			opacity: 0;
			transform: translateY(60px);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	/* ---------- phones and tablets ---------- */

	@media (max-width: 960px) {
		.detail {
			padding-top: 12px;
		}

		.sheet {
			border-radius: 22px 22px 0 0;
		}

		.hero {
			grid-template-columns: 1fr;
			gap: 8px;
			padding-top: 8px;
		}

		.features,
		.stack {
			grid-template-columns: 1fr;
		}

		.block {
			margin-top: 64px;
		}
	}

	@media (max-width: 560px) {
		.pos {
			display: none;
		}

		.bar {
			padding: 12px 0;
		}

		.words {
			gap: 18px;
			padding-top: 8px;
		}

		.app-icon {
			width: 60px;
			height: 60px;
			border-radius: 15px;
		}

		.about {
			font-size: 16px;
		}

		.block {
			margin-top: 48px;
			padding-top: 32px;
		}

		.features {
			gap: 32px;
			margin-top: 32px;
		}

		.feature {
			grid-template-columns: 48px 1fr;
			gap: 14px;
		}

		.num {
			font-size: 44px;
		}

		.feature h4 {
			font-size: 20px;
		}

		.feature p {
			font-size: 15px;
		}
	}
</style>
