<script lang="ts">
	import { onMount } from 'svelte';
	import { INTRO_TIMING as T } from '#lib/intro.js';
	import Orbits from './Orbits.svelte';

	// The logo the intro draws (see Splash.svelte for the backdrop; every timing is in intro.ts). It lives
	// inside the hero's mark, laid exactly over it, and starts out pushed to the middle of the
	// screen. The glide is just that push easing back to nothing, so the logo always lands on the
	// hero's mark by construction. Measuring the hero and flying a separate overlay to it kept
	// missing by ~27px in real Safari, which reports layer coordinates offset by its toolbar.
	let visible = $state(true);
	let go = $state(false);
	let el: HTMLDivElement | undefined = $state();

	onMount(() => {
		const root = document.documentElement;
		if (root.dataset.intro !== 'play' || !el) {
			visible = false;
			return;
		}
		const logo = el;

		// Where the logo sits while it draws: centred on screen, min(300px, 70vw) wide. Any error in
		// these coordinates only shifts that starting spot; the landing spot is fixed by layout.
		let gliding = false;
		const centre = () => {
			if (gliding) return;
			logo.style.transform = '';
			const r = logo.getBoundingClientRect();
			if (!r.width) return;
			const dx = root.clientWidth / 2 - (r.left + r.width / 2);
			const dy = window.innerHeight / 2 - (r.top + r.height / 2);
			const scale = Math.min(300, root.clientWidth * 0.7) / r.width;
			logo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
		};
		centre();
		window.addEventListener('resize', centre);
		go = true;

		const timers: number[] = [];
		const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

		at(T.travelAt, () => {
			gliding = true;
			logo.animate([{ transform: logo.style.transform }, { transform: 'none' }], {
				duration: T.travelMs,
				easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
				fill: 'forwards'
			});
			logo.style.transform = '';
		});

		at(T.logoOutAt, () => {
			logo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.logoOutMs, fill: 'forwards' });
		});

		at(T.doneAt, () => (visible = false));

		return () => {
			timers.forEach(clearTimeout);
			window.removeEventListener('resize', centre);
		};
	});
</script>

{#if visible}
	<div
		class="intro-logo"
		class:go
		aria-hidden="true"
		bind:this={el}
		style:--ring-draw-at="{T.ringDrawAt}ms"
		style:--ring-draw-ms="{T.ringDrawMs}ms"
		style:--ring-fill-at="{T.ringFillAt}ms"
		style:--letters-draw-at="{T.lettersDrawAt}ms"
		style:--letters-draw-ms="{T.lettersDrawMs}ms"
		style:--letters-fill-at="{T.lettersFillAt}ms"
		style:--fill-ms="{T.fillMs}ms"
		style:--cloud-in-at="{T.cloudInAt}ms"
		style:--cloud-in-ms="{T.cloudInMs}ms"
		style:--cloud-out-at="{T.cloudOutAt}ms"
		style:--cloud-out-ms="{T.cloudOutMs}ms"
	>
		<div class="cloud"><Orbits width="220%" /></div>
		<svg viewBox="0 0 256 256">
			<path
				class="ring"
				pathLength="1000"
				d="M61.85 133.26 72.66 115.44 54.88 120.82 39.75 126.53 27.06 132.64 21.72 135.83 17.50 138.80 13.79 141.95 10.79 145.17 8.59 148.31 7.08 151.49 6.22 154.79 6.10 158.25 6.76 161.59 8.17 164.72 10.55 167.91 13.79 170.79 17.83 173.32 22.90 175.63 28.94 177.64 35.78 179.31 43.37 180.65 52.04 181.71 71.41 182.76 93.44 182.41 116.87 180.63 140.77 177.50 164.18 173.16 185.74 167.89 205.13 161.79 213.79 158.50 221.64 155.07 228.40 151.66 234.29 148.16 239.16 144.68 243.11 141.17 246.15 137.61 248.35 133.89 249.59 130.23 249.94 126.43 249.61 123.79 248.88 121.43 247.66 119 245.95 116.66 241.54 112.74 235.34 109.30 227.36 106.45 217.86 104.22 206.31 102.54 193.50 101.53 190.82 106.79 197.25 110.98 200.26 113.73 202.37 116.21 217.07 118.33 222.96 119.75 228.22 121.50 232.40 123.50 235.22 125.65 235.94 127.01 235.05 129.06 233.03 131.45 229.99 134.08 221.68 139.38 210.15 144.85 196.66 149.91 181.14 154.63 164.53 158.75 146.41 162.37 128.24 165.18 109.56 167.27 91.38 168.49 74.24 168.80 58.65 168.21 44.76 166.70 33.53 164.39 28.97 162.95 25.01 161.27 22.05 159.48 20.25 157.65 20.06 156.90 20.49 155.71 22.97 152.55 26.68 149.41 31.92 145.98 38.01 142.71 45.20 139.42Z"
			/>
			<path
				class="letters"
				pathLength="1000"
				fill-rule="evenodd"
				d="M138.14 157.67 155.80 154.48 172.65 150.66 188.18 146.34 201.86 141.69 202.31 135.16 201.57 128.61 199.56 122.98 196.64 118.66 192.58 114.95 187.31 111.74 181.54 109.29 171.35 106.02 167.77 104.35 164.83 101.81 164.12 100.43 163.81 98.80 164.28 95.75 166 93.28 169.08 91.40 172.74 90.61 176.85 90.77 181.08 91.88 185.16 93.82 189.24 96.67 198.60 78.32 190.85 74.82 183.19 72.53 175.21 71.22 167.44 71.10 160.50 72.22 154.37 74.51 149.23 77.82 145.11 82.09 142.81 85.63 141.15 89.27 139.98 93.22 139.38 97.08 139.22 102 139.66 106.55 140.59 110.14 142.13 113.45 143.73 115.87 145.78 118.18 150.97 122 155.99 124.28 170.27 129.39 174.27 131.50 175.84 132.89 176.92 134.51 177.48 136.39 177.58 138.58 177.20 140.38 176.39 142.06 175.12 143.63 173.62 144.86 170.11 146.23 165.25 146.58 160.17 145.80 155.35 144.03 150.48 141.22 145.56 137.36 135.48 156.32 137.63 157.75ZM52.92 161.69 69.29 162.71 87.47 162.63 107.10 161.46 127.60 159.21 127.60 144.08 89.68 144.08 132.28 73.52 57.40 73.52 57.40 93.44 93.04 93.44 51.68 161.56Z"
			/>
		</svg>
	</div>
{/if}

<style>
	.intro-logo {
		display: none;
		position: absolute;
		inset: 0;
		transform-origin: center;
	}

	:global(html[data-intro]) .intro-logo {
		display: block;
	}

	.cloud {
		position: absolute;
		inset: 0;
		opacity: 0;
	}

	svg {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	path {
		fill: rgb(0 0 0 / 0);
		stroke: var(--black);
		stroke-width: 1.4;
		stroke-linejoin: round;
		stroke-dasharray: 1000;
		stroke-dashoffset: 1000;
	}

	/* Animations wait for .go, added once the logo has been moved to the middle of the screen,
	   so nothing is ever drawn at the hero's spot first. */
	.go .cloud {
		/* Gone before the logo starts gliding, so it never overlaps the hero's own orbits
		   (two sets of rings at different scales read as a doubled pattern). */
		animation:
			fade-in var(--cloud-in-ms) ease-out var(--cloud-in-at) forwards,
			fade-out var(--cloud-out-ms) ease-in var(--cloud-out-at) forwards;
	}

	.go .ring {
		animation:
			draw var(--ring-draw-ms) var(--ease-in-out) var(--ring-draw-at) forwards,
			fill var(--fill-ms) ease-out var(--ring-fill-at) forwards;
	}

	.go .letters {
		animation:
			draw var(--letters-draw-ms) var(--ease-in-out) var(--letters-draw-at) forwards,
			fill var(--fill-ms) ease-out var(--letters-fill-at) forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes fill {
		to {
			fill: rgb(0 0 0 / 1);
			stroke-opacity: 0;
		}
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
