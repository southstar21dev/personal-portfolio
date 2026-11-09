// Card screenshots (optimised to AVIF/WebP at build by @sveltejs/enhanced-img) and app icons.
// Sources: each app's own repo — native screenshots and real app icons, not web versions.
// The detail view's screenshots are in project-screens.ts, which loads only when it's needed.
import type { Picture } from '@sveltejs/enhanced-img';
import type { Slug } from '#lib/projects.js';

import haradaShot from '#lib/assets/projects/harada.jpg?enhanced';
import mirkazimShot from '#lib/assets/projects/mirkazim.jpg?enhanced';
import kaloriaShot from '#lib/assets/projects/kaloria.jpg?enhanced';
import droidtoshShot from '#lib/assets/projects/droidtosh.jpg?enhanced';
import volumShot from '#lib/assets/projects/volum.jpg?enhanced';
import vectraShot from '#lib/assets/projects/vectra.jpg?enhanced';

import haradaIcon from '#lib/assets/projects/harada-icon.png';
import mirkazimIcon from '#lib/assets/projects/mirkazim-icon.png';
import kaloriaIcon from '#lib/assets/projects/kaloria-icon.png';
import droidtoshIcon from '#lib/assets/projects/droidtosh-icon.png';
import volumIcon from '#lib/assets/projects/volum-icon.png';
import vectraIcon from '#lib/assets/projects/vectra-icon.png';

export const shots: Record<Slug, Picture> = {
	harada: haradaShot,
	mirkazim: mirkazimShot,
	kaloria: kaloriaShot,
	droidtosh: droidtoshShot,
	volum: volumShot,
	vectra: vectraShot
};

export const icons: Record<Slug, string> = {
	harada: haradaIcon,
	mirkazim: mirkazimIcon,
	kaloria: kaloriaIcon,
	droidtosh: droidtoshIcon,
	volum: volumIcon,
	vectra: vectraIcon
};
