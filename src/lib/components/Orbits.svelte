<script lang="ts">
	// Faint rings tilted like the ring in the ZS logo, as if the subject sends out ripples.
	// Centred on its positioned parent; `width` is relative to that parent (the subject),
	// so the innermost ring sits just outside it and the outermost reaches 2.4x its width.
	let { width = '250%', opacity = 1 }: { width?: string; opacity?: number } = $props();

	// rx in units of 1% of the svg width (viewBox is 250 wide = `width`)
	const rings = [
		{ rx: 60, o: 1 },
		{ rx: 75, o: 0.8 },
		{ rx: 90, o: 0.6 },
		{ rx: 105, o: 0.42 },
		{ rx: 120, o: 0.26 }
	];
</script>

<svg
	class="orbits"
	viewBox="-125 -66 250 132"
	aria-hidden="true"
	focusable="false"
	style:--orbits-w={width}
	style:opacity
>
	<g transform="rotate(-9)">
		{#each rings as ring (ring.rx)}
			<ellipse
				rx={ring.rx}
				ry={ring.rx * 0.375}
				stroke-opacity={ring.o}
				vector-effect="non-scaling-stroke"
			/>
		{/each}
	</g>
</svg>

<style>
	.orbits {
		position: absolute;
		left: 50%;
		top: 50%;
		width: var(--orbits-w);
		height: auto;
		transform: translate(-50%, -50%);
		overflow: visible;
		pointer-events: none;
		fill: none;
		stroke: color-mix(in srgb, var(--accent) 30%, transparent);
		stroke-width: 1.5;
		/* the far ends of each ring dissolve, so they never end in a hard edge */
		-webkit-mask-image: radial-gradient(closest-side, #000 40%, transparent 96%);
		mask-image: radial-gradient(closest-side, #000 40%, transparent 96%);
	}
</style>
