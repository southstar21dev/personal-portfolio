<script lang="ts">
	import { onMount } from 'svelte';
	import { INTRO_SEEN_KEY, INTRO_TIMING as T } from '#lib/intro.js';
	import { lockScroll } from '#lib/motion.js';

	// The intro's white backdrop, scroll lock and timeline. The logo itself is IntroLogo.svelte,
	// inside the hero. Rendered on every page but only shown while <html data-intro> is set
	// (decided in app.html), so there is no flash either way. Removed once finished or skipped.
	let visible = $state(true);
	let backdrop: HTMLDivElement | undefined = $state();

	onMount(() => {
		const root = document.documentElement;
		if (root.dataset.intro !== 'play') {
			visible = false;
			return;
		}

		// Lock scrolling for the whole intro. Hiding overflow alone isn't enough: desktop Safari still
		// lets a trackpad nudge the page.
		window.scrollTo({ top: 0, behavior: 'instant' });
		const unlock = lockScroll();
		const block = (e: Event) => e.preventDefault();
		const blockKeys = (e: KeyboardEvent) => {
			if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
				e.preventDefault();
			}
		};
		window.addEventListener('wheel', block, { passive: false });
		window.addEventListener('touchmove', block, { passive: false });
		window.addEventListener('keydown', blockKeys);
		const unblock = () => {
			window.removeEventListener('wheel', block);
			window.removeEventListener('touchmove', block);
			window.removeEventListener('keydown', blockKeys);
		};

		const timers: number[] = [];
		const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

		at(T.revealAt, () => {
			root.dataset.intro = 'reveal';
			backdrop?.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: T.revealMs,
				easing: 'ease-in-out',
				fill: 'forwards'
			});
		});

		const finish = () => {
			unblock();
			delete root.dataset.intro;
			unlock();
			try {
				sessionStorage.setItem(INTRO_SEEN_KEY, '1');
			} catch {
				// storage blocked: the intro just won't be remembered
			}
			visible = false;
		};
		at(T.doneAt, finish);

		return () => {
			timers.forEach(clearTimeout);
			if (root.dataset.intro) finish();
		};
	});
</script>

{#if visible}
	<div class="splash" aria-hidden="true" data-testid="splash">
		<div class="backdrop" bind:this={backdrop}></div>
	</div>
{/if}

<style>
	/* Positioned in the page (absolute, scroll is locked at the top), like the hero it covers. */
	.splash {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100lvh;
		z-index: 100;
		pointer-events: none;
	}

	:global(html[data-intro]) .splash {
		display: block;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		background: var(--bg);
	}
</style>
