<script lang="ts">
	import { onMount } from 'svelte';
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { projects, projectBySlug, type Project, type Slug } from '#lib/projects.js';
	import { shots, icons } from '#lib/projects-media.js';
	import { prefersReducedMotion, revealOnScroll, scrollVars } from '#lib/motion.js';
	import { imageLoading } from '#lib/image-loading.js';

	// ---------- the detail view: opened by a card, kept in the URL as #<slug> ----------
	// Shallow routing: opening pushes a history entry, so the browser's Back button closes it.
	const openProject = $derived(projectBySlug(page.state.project ?? '') ?? null);

	// The detail view and its ~100 screenshots load on demand (first hover, focus or open, or once
	// the browser is idle), keeping them out of the home page's first download.
	type DetailModule = typeof import('./ProjectDetail.svelte');
	type ScreensModule = typeof import('#lib/project-screens.js');
	let Detail: DetailModule['default'] | undefined = $state();
	let loading: Promise<[DetailModule, ScreensModule]> | undefined;

	function loadDetail() {
		loading ??= Promise.all([
			import('./ProjectDetail.svelte'),
			import('#lib/project-screens.js')
		]).catch((err) => {
			// Let the next attempt try again (a flaky network, or a tab left open across a deploy).
			loading = undefined;
			throw err;
		});
		return loading.then((mods) => {
			Detail = mods[0].default;
			return mods;
		});
	}

	/** Load in the background; a failure here is retried by the next hover, focus or open. */
	const warmUp = () => loadDetail().catch(() => {});

	function preload(project: Project) {
		loadDetail()
			.then(([, m]) => m.preloadProject(project))
			.catch(() => {});
	}

	function open(e: MouseEvent, slug: Slug) {
		e.preventDefault();
		// Keep Lenis's anchor scrolling and the router from treating #slug as a section link.
		e.stopPropagation();
		// `pushed` marks an entry this page added, so closing can step back over it.
		pushState(`#${slug}`, { project: slug, pushed: true });
		loadDetail().catch(() => {
			// The sheet couldn't load (e.g. the site was redeployed since this tab opened):
			// a full load of the same URL fetches the current files and opens it from the hash.
			location.reload();
		});
	}

	function close() {
		// Opened from a card: step back over its history entry. Opened from a shared link: there's
		// no entry of ours to step back over, so drop the hash instead.
		if (page.state.pushed) history.back();
		else replaceState(page.url.pathname, {});
	}

	function navigate(slug: Slug) {
		replaceState(`#${slug}`, { project: slug, pushed: page.state.pushed });
	}

	onMount(() => {
		// A shared link straight to a project (/#kaloria) opens it.
		const linked = projectBySlug(decodeURIComponent(location.hash.slice(1)));
		if (linked) {
			warmUp();
			// Closing it then leaves the visitor at the projects, not the top of the page.
			section?.scrollIntoView({ behavior: 'instant' });
			replaceState(`#${linked.slug}`, { project: linked.slug });
			return;
		}
		if ('requestIdleCallback' in window) {
			const id = requestIdleCallback(warmUp, { timeout: 4000 });
			return () => cancelIdleCallback(id);
		}
		const id = setTimeout(warmUp, 2000);
		return () => clearTimeout(id);
	});

	interface Place {
		left: string;
		top: number;
		w: number;
		rot: number;
		depth: number;
	}

	// Where each card sits on the desktop "scatter" (left as % of the field, top in px),
	// its tilt and its parallax depth. Below 900px the field becomes a plain grid.
	const place: Record<Slug, Place> = {
		harada: { left: '1%', top: 30, w: 440, rot: -3, depth: 0.8 },
		kaloria: { left: '42%', top: 0, w: 230, rot: 4, depth: 1.1 },
		mirkazim: { left: '64%', top: 140, w: 400, rot: 2.5, depth: 0.7 },
		droidtosh: { left: '5%', top: 430, w: 230, rot: 3.5, depth: 1.2 },
		volum: { left: '37%', top: 540, w: 230, rot: -2.5, depth: 0.9 },
		vectra: { left: '72%', top: 490, w: 230, rot: -4, depth: 1 }
	};

	// The app icons floating loose between the cards (they sit "closer", so they move more).
	const floating: {
		slug: Slug;
		size: number;
		left: string;
		top: number;
		rot: number;
		depth: number;
	}[] = [
		{ slug: 'kaloria', size: 64, left: '32%', top: 410, rot: -10, depth: 2.2 },
		{ slug: 'droidtosh', size: 72, left: '60%', top: 520, rot: 9, depth: 2.6 },
		{ slug: 'vectra', size: 60, left: '92%', top: 20, rot: 12, depth: 2 },
		{ slug: 'harada', size: 58, left: '27%', top: 900, rot: -6, depth: 2.4 },
		{ slug: 'volum', size: 64, left: '60%', top: 880, rot: 10, depth: 2.2 },
		{ slug: 'mirkazim', size: 56, left: '95%', top: 470, rot: -8, depth: 2 }
	];

	let section: HTMLElement | undefined = $state();

	// ---------- pointer parallax ----------
	// The pointer's position over the field (-1…1 on each axis) goes into two CSS variables, once
	// per frame; CSS moves each piece by its own --depth. Off for reduced motion.
	let frame = 0;

	function setPointer(field: HTMLElement, x: number, y: number) {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			field.style.setProperty('--mx', x.toFixed(3));
			field.style.setProperty('--my', y.toFixed(3));
		});
	}

	function onmove(e: MouseEvent) {
		if (prefersReducedMotion()) return;
		const field = e.currentTarget as HTMLElement;
		const r = field.getBoundingClientRect();
		setPointer(
			field,
			Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)),
			Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
		);
	}

	function onleave(e: MouseEvent) {
		setPointer(e.currentTarget as HTMLElement, 0, 0);
	}

	onMount(() => () => cancelAnimationFrame(frame));
</script>

<section
	id="projects"
	class="projects"
	bind:this={section}
	use:scrollVars
	use:revealOnScroll={0.12}
	aria-labelledby="projects-title"
>
	<div class="ghost-word watermark" aria-hidden="true">WORK</div>

	<div class="container inner">
		<h2 id="projects-title" class="display rise">PROJECTS</h2>

		<div class="field" role="presentation" onmousemove={onmove} onmouseleave={onleave}>
			{#each floating as icon, i (icon.slug)}
				<div
					class="slot float-icon"
					aria-hidden="true"
					use:revealOnScroll
					style:left={icon.left}
					style:top="{icon.top}px"
					style:width="{icon.size}px"
					style:--depth={icon.depth}
				>
					<div class="depth">
						<div
							class="enter"
							style:animation-delay="{0.35 + (i % 3) * 0.08}s"
							style:--er="{icon.rot}deg"
						>
							<div
								class="bob"
								style:animation-duration="{4.8 + (i % 3) * 0.7}s"
								style:animation-delay="{-i * 0.6}s"
							>
								<img
									class="img-fade"
									src={icons[icon.slug]}
									alt=""
									width={icon.size}
									height={icon.size}
									style:transform="rotate({icon.rot}deg)"
									use:imageLoading
								/>
							</div>
						</div>
					</div>
				</div>
			{/each}

			<ul class="cards">
				{#each projects as project, i (project.slug)}
					{@const p = place[project.slug]}
					<li
						class="slot"
						class:wide={project.shape !== 'phone'}
						use:revealOnScroll
						style:left={p.left}
						style:top="{p.top}px"
						style:width="{p.w}px"
						style:z-index={10 + i}
						style:--depth={p.depth}
					>
						<div class="depth">
							<div
								class="enter"
								style:animation-delay="{(i % 3) * 0.1}s"
								style:--er="{p.rot * 3}deg"
							>
								<div
									class="bob"
									style:animation-duration="{5.5 + (i % 3) * 0.9}s"
									style:animation-delay="{-i * 0.8}s"
								>
									<a
										class="card"
										class:phone={project.shape === 'phone'}
										style:--r="{p.rot}deg"
										href="#{project.slug}"
										aria-haspopup="dialog"
										onclick={(e) => open(e, project.slug)}
										onpointerenter={() => preload(project)}
										onfocus={() => preload(project)}
									>
										<div class="preview img-load" use:imageLoading>
											<enhanced:img
												src={shots[project.slug]}
												alt="{project.name} screenshot"
												sizes={project.shape === 'phone'
													? '230px'
													: '(min-width: 900px) 440px, 90vw'}
											/>
										</div>
										<div class="meta">
											<img
												class="icon img-fade"
												src={icons[project.slug]}
												alt=""
												width="34"
												height="34"
												use:imageLoading
											/>
											<div class="text">
												<h3>{project.name}</h3>
												<p>
													<span>{project.platform}</span>
													<span class="status" class:shipped={project.status === 'Shipped'}>
														{project.status}
													</span>
												</p>
											</div>
										</div>
										<p class="visually-hidden">{project.summary}</p>
									</a>
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

{#if Detail}
	<Detail project={openProject} onclose={close} onnavigate={navigate} />
{/if}

<style>
	.projects {
		position: relative;
		overflow: hidden;
		padding-top: 96px;
		/* --pass: 0 as the section enters the bottom of the screen → 1 as it leaves the top */
		--pass: 0;
	}

	.watermark {
		top: 56px;
		right: -2vw;
		font-size: 24vw;
		/* slides in from the right as you scroll through the section */
		transform: translateX(calc((0.5 - var(--pass)) * 40vw));
		will-change: transform;
	}

	.inner {
		position: relative;
		padding-bottom: 120px;
	}

	h2 {
		margin-top: 40px;
		font-size: clamp(64px, 11vw, 176px);
	}

	/* ---------- entrance: each piece waits until it scrolls into view (JS only) ---------- */

	:global(html.js) .projects:not(:global(.shown)) .rise {
		opacity: 0;
	}

	.projects:global(.shown) .rise {
		animation: rise 0.9s var(--ease-out) both;
	}

	:global(html.js) .slot:not(:global(.shown)) .enter {
		opacity: 0;
	}

	.slot:global(.shown) .enter {
		--enter-y: 90px;
		--enter-scale: 0.85;
		animation: card-enter 1.15s var(--ease-out) both;
	}

	/* Scroll depth: deeper pieces travel further as the section passes, so the scatter feels 3-D. */
	.depth {
		transform: translateY(calc((0.5 - var(--pass)) * var(--depth, 1) * 140px));
		will-change: transform;
	}

	/* Where supported, the scroll motion is a scroll-driven animation, run by the browser in step
	   with the scroll instead of from scroll events in JS (which lag in Safari). */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.projects {
				view-timeline: --projects block;
			}

			.watermark,
			.depth {
				animation-duration: auto;
				animation-timing-function: linear;
				animation-fill-mode: both;
				animation-timeline: --projects;
				/* 0 as the section enters the bottom of the screen → 1 as it leaves the top */
				animation-range: cover 0% cover 100%;
			}

			.watermark {
				animation-name: pass-watermark;
			}
		}

		@media (prefers-reduced-motion: no-preference) and (min-width: 901px) {
			.depth {
				animation-name: pass-depth;
			}
		}
	}

	@keyframes pass-watermark {
		from {
			transform: translateX(20vw);
		}
		to {
			transform: translateX(-20vw);
		}
	}

	@keyframes pass-depth {
		from {
			transform: translateY(calc(var(--depth, 1) * 70px));
		}
		to {
			transform: translateY(calc(var(--depth, 1) * -70px));
		}
	}

	/* ---------- the scatter ---------- */

	.field {
		position: relative;
		height: 1060px;
		margin-top: 72px;
	}

	.cards {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.slot {
		position: absolute;
		/* Pointer parallax: --mx/--my come from the field (see onmove), --depth from the slot. */
		transform: translate3d(
			calc(var(--mx, 0) * var(--depth, 1) * -18px),
			calc(var(--my, 0) * var(--depth, 1) * -14px),
			0
		);
		transition: transform 1s var(--ease-out);
	}

	.slot:hover {
		z-index: 30 !important;
	}

	.float-icon {
		z-index: 12;
		pointer-events: none;
		transition-duration: 1.1s;
	}

	.float-icon img {
		display: block;
		border-radius: 22%;
		filter: drop-shadow(0 14px 24px color-mix(in srgb, var(--ink) 24%, transparent));
	}

	.bob {
		animation: bob 6s ease-in-out infinite;
	}

	.card {
		display: block;
		overflow: hidden;
		color: inherit;
		cursor: pointer;
		border-radius: 20px;
		background: var(--bg);
		box-shadow: var(--shadow-card);
		transform: rotate(var(--r));
		transition:
			transform 0.6s var(--ease-out),
			box-shadow 0.6s ease,
			opacity 0.4s ease,
			filter 0.4s ease;
	}

	.card:hover,
	.card:focus-visible {
		transform: rotate(0deg) translateY(-12px) scale(1.045);
		box-shadow: var(--shadow-card-lift);
	}

	/* While a card is hovered, the others fade back. Keyed to the card, not the field, so the
	   gaps between cards don't grey everything out. Real pointers only: on touch, :hover sticks
	   after a tap and would leave the rest of the grid greyed out. */
	@media (hover: hover) {
		.field:has(.card:hover) .card:not(:hover) {
			opacity: 0.6;
			filter: saturate(0.55);
		}
	}

	.preview {
		height: 246px;
		overflow: hidden;
		background: var(--ghost);
	}

	.phone .preview {
		height: 400px;
	}

	.preview :global(img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		transition: transform 1.2s var(--ease-out);
	}

	/* Placeholder colour only while loading; afterwards it would show as a pale line along the
	   card's anti-aliased edge (see .shot in global.css). */
	.preview:global([data-loaded]) {
		background: transparent;
	}

	.card:hover .preview :global(img) {
		transform: scale(1.06);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
	}

	.icon {
		flex: none;
		width: 34px;
		height: 34px;
		border-radius: 9px;
	}

	.text {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 800;
		font-stretch: 85%;
		letter-spacing: -0.005em;
		white-space: nowrap;
		color: var(--black);
	}

	.text p {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 8px;
		font-size: 12.5px;
		font-weight: 500;
		color: var(--muted-2);
	}

	.text .status {
		font-weight: 600;
		color: var(--muted);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.watermark,
		.depth,
		.slot {
			transform: none;
		}
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	/* Phones and tablets: no hover, no scatter — a tidy grid. Website cards take two columns,
	   phone apps one, and `dense` pairs the phone apps up between the wide cards. */
	@media (max-width: 900px) {
		.projects {
			padding-top: 48px;
		}

		.inner {
			padding-bottom: 80px;
		}

		.field {
			height: auto;
			margin-top: 48px;
		}

		.float-icon {
			display: none;
		}

		.cards {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			grid-auto-flow: row dense;
			gap: 24px 20px;
		}

		.slot.wide {
			grid-column: span 2;
		}

		.depth {
			transform: none;
		}

		.slot {
			position: static;
			width: auto !important;
			transform: none !important;
		}

		/* Cards in a row share a height: the screenshot stretches to fill it. */
		.slot,
		.depth,
		.enter,
		.bob {
			height: 100%;
		}

		.card,
		.card:hover {
			height: 100%;
			display: flex;
			flex-direction: column;
			transform: none;
		}

		/* A website screenshot keeps its shape (cropping it would cut off its left edge); a taller
		   neighbour's extra height goes to the caption row instead. Phone screenshots, cropped from
		   the top, are the ones that stretch. */
		.preview {
			flex: none;
			height: auto;
			aspect-ratio: 880 / 492;
		}

		.wide .meta {
			flex: 1 0 auto;
		}

		.phone .preview {
			flex: 1 1 auto;
			height: auto;
			aspect-ratio: 4 / 5;
		}
	}

	@media (max-width: 600px) {
		.projects {
			padding-top: 32px;
		}

		.field {
			margin-top: 32px;
		}

		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 16px 12px;
		}

		.card {
			border-radius: 16px;
		}

		.meta {
			gap: 10px;
			padding: 12px;
		}

		.icon {
			width: 30px;
			height: 30px;
			border-radius: 8px;
		}

		h3 {
			font-size: 16px;
		}

		.text p {
			font-size: 12px;
		}

		.phone .preview {
			aspect-ratio: 3 / 4;
		}
	}
</style>
