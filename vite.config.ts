import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { projects } from './src/lib/projects.ts';

// app.html has one inline script of its own (the intro decision, run before first paint). It sits
// after %sveltekit.head%, which starts with the CSP <meta>, so the policy covers it.
// SvelteKit hashes the scripts it writes; this one has to be allowed by its hash too.
const appHtml = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8');
const introScript = appHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (introScript === undefined) throw new Error('Expected an inline <script> in src/app.html');
const sha256 = (code: string) =>
	`sha256-${createHash('sha256').update(code).digest('base64')}` as const;
const introScriptHash = sha256(introScript);
// Svelte's server-rendered <img> tags carry onload/onerror="this.__e=event", so load events that
// fire before hydration aren't lost. 'unsafe-hashes' allows exactly that handler and nothing else.
const svelteImgHandlerHash = sha256('this.__e=event');

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// 404.html is a client-rendered shell nginx serves for unknown URLs (shows SvelteKit's error page)
			adapter: adapter({ fallback: '404.html' }),
			// Written into each prerendered page as a <meta> tag, with hashes of the inline scripts.
			// frame-ancestors can't go in a <meta>; nginx sends it as a header (nginx/).
			csp: {
				mode: 'hash',
				directives: {
					'default-src': ['self'],
					'script-src': ['self', introScriptHash, 'unsafe-hashes', svelteImgHandlerHash],
					// Svelte writes inline style attributes (style:left, --vars), so they must be allowed.
					'style-src': ['self', 'unsafe-inline'],
					'img-src': ['self'],
					'font-src': ['self'],
					'connect-src': ['self'],
					'object-src': ['none'],
					'base-uri': ['self'],
					'form-action': ['self']
				}
			},
			prerender: {
				// Cards link to /#<slug>, which opens that project's detail view rather than a section.
				handleMissingId: ({ id, message }) => {
					if (projects.some((p) => p.slug === id)) return;
					throw new Error(message);
				}
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
