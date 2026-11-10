<script lang="ts">
	import type { Project, Slug } from '#lib/projects.js';
	import { icons } from '#lib/projects-media.js';
	import { imageLoading } from '#lib/image-loading.js';

	// The large previous / next pair at the bottom of the project sheet.
	interface Props {
		prev: Project;
		next: Project;
		onnavigate: (slug: Slug) => void;
	}

	let { prev, next, onnavigate }: Props = $props();
</script>

<nav class="pager" aria-label="More projects">
	<button class="turn prev" type="button" onclick={() => onnavigate(prev.slug)}>
		<span class="turn-label">Previous project</span>
		<span class="turn-row">
			<span class="arrow" aria-hidden="true">←</span>
			<img
				class="img-fade"
				src={icons[prev.slug]}
				alt=""
				width="72"
				height="72"
				loading="lazy"
				use:imageLoading
			/>
			<span class="turn-name display">{prev.name.toUpperCase()}</span>
		</span>
	</button>
	<button class="turn next" type="button" onclick={() => onnavigate(next.slug)}>
		<span class="turn-label">Next project</span>
		<span class="turn-row">
			<img
				class="img-fade"
				src={icons[next.slug]}
				alt=""
				width="72"
				height="72"
				loading="lazy"
				use:imageLoading
			/>
			<span class="turn-name display">{next.name.toUpperCase()}</span>
			<span class="arrow" aria-hidden="true">→</span>
		</span>
	</button>
</nav>

<style>
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px 64px;
		margin-top: 112px;
		padding: 40px 0 72px;
		border-top: 1px solid var(--line);
	}

	.turn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		min-width: 0;
		min-height: 44px;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		color: var(--black);
		text-align: left;
		cursor: pointer;
	}

	.turn.next {
		align-items: flex-end;
		text-align: right;
	}

	.turn:hover {
		color: var(--muted);
	}

	.turn-label {
		font-size: 15px;
		font-weight: 700;
		color: var(--muted);
	}

	.turn-row {
		display: flex;
		align-items: center;
		gap: 20px;
		min-width: 0;
	}

	.turn-row img {
		flex: none;
		width: 64px;
		height: 64px;
		border-radius: 16px;
	}

	.prev img {
		transform: rotate(-6deg);
	}

	.next img {
		transform: rotate(6deg);
	}

	.turn-name {
		min-width: 0;
		/* Two-word names stack a word per line, and the box hugs them. Left to wrap on its own, the
		   box keeps the full width it was offered, which strands the icon away from the name. */
		width: min-content;
		font-size: clamp(40px, 5.4vw, 92px);
		/* follows the button's hover colour */
		color: inherit;
	}

	.arrow {
		flex: none;
		font-size: clamp(32px, 3.6vw, 60px);
		font-weight: 700;
		transition: transform 0.5s var(--ease-out);
	}

	.prev:hover .arrow {
		transform: translateX(-12px);
	}

	.next:hover .arrow {
		transform: translateX(12px);
	}

	@media (max-width: 960px) {
		.pager {
			grid-template-columns: 1fr;
			margin-top: 64px;
		}
	}

	@media (max-width: 560px) {
		.pager {
			padding: 32px 0 48px;
		}

		.turn-row img {
			width: 44px;
			height: 44px;
		}
	}
</style>
