<script lang="ts">
	import { onMount } from 'svelte';
	import zsMark from '#lib/assets/brand/zs-mark.svg';

	// The page is prerendered, so this starts as the build's year; the visitor's clock updates it.
	let year = $state(new Date().getFullYear());
	onMount(() => {
		year = new Date().getFullYear();
	});
</script>

<footer class="container foot">
	<span class="sign">
		<img src={zsMark} alt="" width="32" height="32" />
		© {year} Ziya Sharifli
	</span>
	<a href="#top">Back to top ↑</a>
</footer>

<style>
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-top: 28px;
		padding-bottom: 40px;
		font-size: 14px;
		color: var(--muted);
	}

	.sign {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.sign img {
		display: block;
		width: 32px;
		height: auto;
	}

	.foot a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-weight: 600;
		color: var(--muted);
	}

	.foot a:hover {
		color: var(--black);
	}

	@media (max-width: 380px) {
		.foot {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
