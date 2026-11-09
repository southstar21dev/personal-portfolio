// The detail view's screenshots, keyed "<slug>/<name>" (see `hero` and `screens` in projects.ts).
// Only the detail view imports this module, and the projects section loads that lazily, so the
// srcsets of ~100 screenshots stay out of the home page's first download.
import type { Picture } from '@sveltejs/enhanced-img';
import type { Project, Slug } from '#lib/projects.js';
import { preloadPicture } from '#lib/image-loading.js';

const screenFiles = import.meta.glob<Picture>('/src/lib/assets/projects/screens/*/*.jpg', {
	eager: true,
	query: { enhanced: true },
	import: 'default'
});

const screens: Record<string, Picture> = Object.fromEntries(
	Object.entries(screenFiles).map(([path, pic]) => [
		path.replace('/src/lib/assets/projects/screens/', '').replace(/\.jpg$/, ''),
		pic
	])
);

export function screen(slug: Slug, name: string): Picture {
	const pic = screens[`${slug}/${name}`];
	if (!pic) throw new Error(`Missing screenshot ${slug}/${name}`);
	return pic;
}

export interface FanSlot {
	left: string;
	top: number;
	w: number;
	rot: number;
	z: number;
}

/** Fan positions for the hero screenshots (desktop); below 960px they become a scrolling row. */
export const fans: Record<Project['hero']['layout'], FanSlot[]> = {
	phones: [
		{ left: '0%', top: 90, w: 230, rot: -5, z: 2 },
		{ left: '31%', top: 0, w: 240, rot: 2, z: 3 },
		{ left: '63%', top: 120, w: 230, rot: 6, z: 1 }
	],
	mac: [
		{ left: '10%', top: 20, w: 600, rot: -2, z: 1 },
		{ left: '0%', top: 330, w: 480, rot: 3, z: 2 }
	],
	web: [{ left: '2%', top: 120, w: 660, rot: -2.5, z: 1 }]
};

export const heroSizes = (p: Project, i: number) =>
	p.hero.layout === 'phones' ? '240px' : `(min-width: 960px) ${fans[p.hero.layout][i].w}px, 86vw`;

/** Fetch a project's hero screenshots ahead of opening it (card hover, neighbours). */
export function preloadProject(p: Project) {
	p.hero.names.forEach((name, i) => preloadPicture(screen(p.slug, name), heroSizes(p, i)));
}
