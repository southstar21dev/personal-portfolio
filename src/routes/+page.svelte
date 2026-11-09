<script lang="ts">
	import zsMark from '#lib/assets/brand/zs-mark.svg';
	import AboutSection from '#lib/components/AboutSection.svelte';
	import ContactSection from '#lib/components/ContactSection.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import ProjectsSection from '#lib/components/ProjectsSection.svelte';
	import IntroLogo from '#lib/components/IntroLogo.svelte';
	import Orbits from '#lib/components/Orbits.svelte';
	import { scrollVars } from '#lib/motion.js';

	// One page: the nav glides to each section.
	const links = [
		{ href: '#about', label: 'About' },
		{ href: '#projects', label: 'Projects' },
		{ href: '#contact', label: 'Contact' }
	];
</script>

<svelte:head>
	<title>Ziya Sharifli — Mobile & web developer</title>
	<meta
		name="description"
		content="Ziya Sharifli designs and builds polished mobile and web apps that feel as good as they look."
	/>
</svelte:head>

<main>
	<section id="top" class="hero" aria-label="Introduction" use:scrollVars>
		<div class="ghost-word watermark" aria-hidden="true">ZIYA</div>

		<div class="container inner">
			<div class="top-space" aria-hidden="true"></div>

			<h1 class="display reveal" style:--d="0s"><span class="drift name">ZIYA SHARIFLI</span></h1>

			<div class="row">
				<div class="col intro reveal" style:--d="0.12s">
					<p class="drift intro-text">
						I design and build polished mobile and web apps that feel as good as they look.
					</p>
				</div>

				<div class="col mark">
					<div class="drift mark-inner">
						<div class="halo" aria-hidden="true"></div>
						<div class="mark-art">
							<div class="cloud"><Orbits width="220%" /></div>
							<img src={zsMark} alt="ZS logo" width="420" height="420" />
							<IntroLogo />
						</div>
					</div>
				</div>

				<div class="col side reveal" style:--d="0.22s">
					<div class="drift side-inner">
						<nav aria-label="Primary">
							{#each links as link (link.href)}
								<a href={link.href}>{link.label}</a>
							{/each}
						</nav>
					</div>
				</div>
			</div>
		</div>
	</section>

	<AboutSection />
	<ProjectsSection />
	<ContactSection />
</main>

<SiteFooter />

<style>
	.hero {
		position: relative;
		min-height: 100svh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* --leave: 0 at the top of the page → 1 once the hero has scrolled away (set by scrollVars) */
		--leave: 0;
	}

	.watermark {
		top: -1vw;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 30vw;
		transform: translateX(calc(var(--leave) * -18vw));
		will-change: transform;
	}

	.inner {
		position: relative;
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
	}

	.top-space {
		height: 92px;
	}

	h1 {
		position: relative;
		z-index: 1;
		margin: 6vw 0 0;
		text-align: center;
		font-size: clamp(56px, 10.6vw, 168px);
		line-height: 0.9;
	}

	.row {
		flex: 1 1 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 32px;
	}

	.col {
		position: relative;
		z-index: 3;
	}

	.intro {
		flex: 1 1 240px;
		padding: 56px 0;
	}

	.intro p {
		margin: 0;
		max-width: 300px;
		font-size: 20px;
		line-height: 1.4;
		font-weight: 650;
	}

	.mark {
		flex: 1 1 400px;
		z-index: 2;
		align-self: center;
		height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mark-inner {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.halo {
		position: absolute;
		inset: -10% -20%;
		background: radial-gradient(
			ellipse 50% 45% at 50% 40%,
			color-mix(in srgb, var(--accent) 10%, transparent),
			transparent 70%
		);
	}

	.cloud {
		position: absolute;
		inset: 0;
	}

	.mark-art {
		position: relative;
		width: min(420px, 90%);
	}

	.mark img {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
	}

	.side {
		flex: 1 1 240px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 56px 0;
	}

	.side-inner {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 28px;
		text-align: right;
	}

	nav {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}

	/* ---------- scroll: the hero drifts apart as you leave it ---------- */

	.drift {
		display: block;
		will-change: transform, opacity;
	}

	/* .drift above would otherwise turn the mark's centring flexbox back into a block. */
	.drift.mark-inner {
		display: flex;
	}

	.name {
		transform: translateY(calc(var(--leave) * -160px));
		opacity: calc(1 - var(--leave) * 1.4);
	}

	.intro-text {
		transform: translateY(calc(var(--leave) * -280px));
		opacity: calc(1 - var(--leave) * 1.8);
	}

	.side-inner {
		transform: translateY(calc(var(--leave) * -220px));
		opacity: calc(1 - var(--leave) * 1.8);
	}

	.mark-inner {
		transform: translateY(calc(var(--leave) * 140px)) scale(calc(1 - var(--leave) * 0.3))
			rotate(calc(var(--leave) * -12deg));
		opacity: calc(1 - var(--leave) * 1.1);
	}

	/* Where supported, the drift is a scroll-driven animation instead: the same motion, but run by
	   the browser in step with the scroll rather than from scroll events in JS (which Safari
	   delivers late, so the hero lagged the page). scrollVars stays as the fallback. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.hero {
				view-timeline: --hero block;
			}

			.watermark,
			.name,
			.intro-text,
			.side-inner,
			.mark-inner {
				animation-duration: auto;
				animation-timing-function: linear;
				animation-fill-mode: both;
				animation-timeline: --hero;
				/* 0 with the hero at the top of the screen → 1 once it has scrolled off */
				animation-range: exit-crossing 0% exit-crossing 100%;
			}

			.watermark {
				animation-name: leave-watermark;
			}
			.name {
				animation-name: leave-name;
			}
			.intro-text {
				animation-name: leave-intro;
			}
			.side-inner {
				animation-name: leave-side;
			}
			.mark-inner {
				animation-name: leave-mark;
			}
		}
	}

	@keyframes leave-watermark {
		from {
			transform: none;
		}
		to {
			transform: translateX(-18vw);
		}
	}

	@keyframes leave-name {
		from {
			transform: none;
			opacity: 1;
		}
		71.4% {
			opacity: 0;
		}
		to {
			transform: translateY(-160px);
			opacity: 0;
		}
	}

	@keyframes leave-intro {
		from {
			transform: none;
			opacity: 1;
		}
		55.6% {
			opacity: 0;
		}
		to {
			transform: translateY(-280px);
			opacity: 0;
		}
	}

	@keyframes leave-side {
		from {
			transform: none;
			opacity: 1;
		}
		55.6% {
			opacity: 0;
		}
		to {
			transform: translateY(-220px);
			opacity: 0;
		}
	}

	@keyframes leave-mark {
		from {
			transform: translateY(0) scale(1) rotate(0deg);
			opacity: 1;
		}
		90.9% {
			opacity: 0;
		}
		to {
			transform: translateY(140px) scale(0.7) rotate(-12deg);
			opacity: 0;
		}
	}

	/* ---------- intro: hero content rises in as the splash backdrop fades (Splash.svelte) ---------- */

	.reveal {
		transition:
			opacity 0.9s var(--ease-out),
			transform 0.9s var(--ease-out);
		transition-delay: var(--d, 0s);
	}

	:global(html[data-intro='play']) .reveal {
		opacity: 0;
		transform: translateY(24px);
	}

	/* The intro logo (IntroLogo.svelte) lives in the mark, so the mark sits above the splash
	   backdrop for the whole intro. Its own art stays hidden, then fades in with the backdrop. */
	:global(html[data-intro]) .mark {
		z-index: 101;
	}

	.halo,
	.cloud,
	.mark img {
		transition: opacity 0.7s ease-in-out;
	}

	:global(html[data-intro='play']) :is(.halo, .cloud, .mark img) {
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.watermark,
		.drift {
			transform: none;
			opacity: 1;
		}
	}

	@media (max-width: 900px) {
		.top-space {
			height: 48px;
		}

		.intro,
		.side {
			padding: 24px 0;
		}

		.mark {
			height: 360px;
			order: 2;
		}

		.side {
			order: 3;
		}

		.side-inner {
			align-items: flex-start;
			text-align: left;
		}

		nav {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 4px 24px;
		}
	}

	/* Phones: one centred column that fills the first screen. Name and line up top, the mark in
	   the middle taking whatever height is left, the links at the bottom. */
	@media (max-width: 600px) {
		.top-space {
			height: 20px;
		}

		h1 {
			margin-top: 6vw;
			font-size: 14.2vw;
		}

		.row {
			flex-direction: column;
			flex-wrap: nowrap;
			gap: 0;
		}

		.intro {
			flex: none;
			padding: 20px 0 0;
		}

		.intro p {
			max-width: 24ch;
			margin: 0 auto;
			font-size: clamp(17px, 5.4vw, 23px);
			line-height: 1.32;
			text-align: center;
			text-wrap: balance;
		}

		.mark {
			flex: 1 1 auto;
			order: 1;
			align-self: stretch;
			height: auto;
			min-height: 240px;
		}

		.mark-art {
			width: min(380px, 90%);
		}

		.side {
			flex: none;
			order: 2;
			padding: 0 0 max(28px, 4svh);
		}

		.side-inner {
			align-items: center;
			gap: 6px;
			text-align: center;
		}

		nav {
			justify-content: center;
			gap: 0 clamp(18px, 6vw, 32px);
			font-size: clamp(18px, 5.8vw, 24px);
		}
	}
</style>
