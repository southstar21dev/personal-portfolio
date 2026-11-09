import type { Picture } from '@sveltejs/enhanced-img';

/**
 * Svelte action for an image, or for the box an image sits in. Until every image inside has
 * loaded (or failed), the element has no `data-loaded` attribute: global.css then shows a small
 * spinner on `.img-load` boxes and keeps the picture transparent, and fades it in once loaded.
 * Images that are already in the cache are marked loaded straight away, so they never flash a
 * spinner. Without JavaScript nothing is hidden (the rules are scoped to html.js).
 */
export function imageLoading(node: HTMLElement) {
	const images = node instanceof HTMLImageElement ? [node] : [...node.querySelectorAll('img')];

	const check = () => {
		if (images.every((img) => img.complete)) node.setAttribute('data-loaded', '');
	};

	for (const img of images) {
		img.addEventListener('load', check);
		img.addEventListener('error', check);
	}
	check();

	return {
		destroy() {
			for (const img of images) {
				img.removeEventListener('load', check);
				img.removeEventListener('error', check);
			}
		}
	};
}

const requested = new Set<string>();

/**
 * Starts downloading a picture before it is shown. The browser picks the same file from the
 * srcset as the real <img> will later (same `sizes`), so that one is then a cache hit.
 */
export function preloadPicture(picture: Picture, sizes: string) {
	const srcset = picture.sources.avif ?? picture.sources.webp ?? '';
	const key = `${srcset}|${sizes}`;
	if (requested.has(key)) return;
	requested.add(key);

	const img = new Image();
	img.decoding = 'async';
	img.sizes = sizes;
	img.srcset = srcset;
	img.src = picture.img.src;
}
