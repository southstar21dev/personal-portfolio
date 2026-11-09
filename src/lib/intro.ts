// The logo intro (see Splash.svelte and IntroLogo.svelte). The decision to play it is made in
// src/app.html before first paint: it plays once per session, only when the visit starts on "/",
// and never for visitors who prefer reduced motion. While it runs, <html data-intro="play"> is
// set; when the white backdrop starts fading it switches to "reveal" so the hero content can
// rise in.

/** sessionStorage key. app.html can't import this, so it repeats it (intro.spec.ts checks they match). */
export const INTRO_SEEN_KEY = 'zs-intro';

/** Milliseconds from page load. */
export const INTRO_TIMING = {
	// Drawing the logo (CSS animations in IntroLogo.svelte, started when it is centred)
	ringDrawAt: 200,
	ringDrawMs: 1500,
	ringFillAt: 1600,
	lettersDrawAt: 550,
	lettersDrawMs: 1400,
	lettersFillAt: 1850,
	fillMs: 600,
	cloudInAt: 1900,
	cloudInMs: 700,
	cloudOutAt: 2450,
	cloudOutMs: 350,
	// Gliding onto the hero and handing over (JS, Splash.svelte and IntroLogo.svelte)
	travelAt: 2800,
	travelMs: 750,
	revealAt: 3550,
	revealMs: 700,
	logoOutAt: 4250,
	logoOutMs: 200,
	doneAt: 4450
} as const;
