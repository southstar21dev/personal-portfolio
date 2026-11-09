<script lang="ts">
	import type { Project } from '#lib/projects.js';
	import { fans, heroSizes, screen } from '#lib/project-screens.js';
	import { imageLoading } from '#lib/image-loading.js';

	// The project sheet's hero screenshots, fanned out beside the title on desktop and a
	// sideways-scrolling row below 960px.
	let { project: p }: { project: Project } = $props();
</script>

<div class="fan fan-{p.hero.layout}">
	{#each p.hero.names as name, i (name)}
		{@const f = fans[p.hero.layout][i]}
		<div
			class="fan-slot"
			style:left={f.left}
			style:top="{f.top}px"
			style:width="{f.w}px"
			style:z-index={f.z}
		>
			<div class="enter" style:animation-delay="{0.15 + i * 0.12}s" style:--er="{f.rot * 3}deg">
				<div class="shot img-load" style:--r="{f.rot}deg" use:imageLoading>
					<enhanced:img
						src={screen(p.slug, name)}
						alt="{p.name}: {name.replace(/-/g, ' ')}"
						sizes={heroSizes(p, i)}
						decoding="async"
					/>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.fan {
		position: relative;
		height: 660px;
	}

	.fan-web {
		height: 520px;
	}

	.fan-slot {
		position: absolute;
	}

	.fan-slot:hover {
		z-index: 30 !important;
	}

	.enter {
		--enter-y: 70px;
		--enter-scale: 0.88;
		animation: card-enter 1.1s var(--ease-out) both;
	}

	@media (hover: hover) {
		.shot:hover {
			transform: rotate(0deg) translateY(-10px) scale(1.03);
			box-shadow: var(--shadow-card-lift);
		}
	}

	@media (max-width: 960px) {
		.fan,
		.fan-web {
			height: auto;
			display: flex;
			gap: 20px;
			margin: 0 calc(var(--gutter) * -1);
			padding: 32px calc(var(--gutter) + 12px) 40px;
			overflow-x: auto;
			overflow-y: hidden;
		}

		.fan-slot {
			position: static;
			flex: none;
			width: min(70vw, 260px) !important;
		}

		.fan-mac .fan-slot,
		.fan-web .fan-slot {
			width: 86vw !important;
		}
	}
</style>
