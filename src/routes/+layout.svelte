<script lang="ts">
	import 'lenis/dist/lenis.css';
	import '#lib/styles/global.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Splash from '#lib/components/Splash.svelte';
	import { startSmoothScroll } from '#lib/motion.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(startSmoothScroll);
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="48x48" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="theme-color" content="#ffffff" />
	<!-- 404.html and other error pages shouldn't show up in search results -->
	{#if page.error}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<Splash />
{@render children()}
