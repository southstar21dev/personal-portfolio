import { describe, expect, it } from 'vitest';
import { projects } from './projects.js';
import { fans } from './project-screens.js';

describe('projects', () => {
	it('has unique slugs and complete entries', () => {
		expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
		for (const p of projects) {
			expect(p.slug).toMatch(/^[a-z0-9-]+$/);
			expect(p.name.length).toBeGreaterThan(0);
			expect(p.summary.length).toBeGreaterThan(0);
			expect(p.hero.names.length).toBeGreaterThan(0);
		}
	});

	it('has a screenshot file for every hero and screen image', () => {
		const files = Object.keys(import.meta.glob('/src/lib/assets/projects/screens/*/*.jpg'));
		for (const p of projects) {
			const names = [...p.hero.names, ...p.screens.flatMap((g) => g.items.map((i) => i.name))];
			for (const name of names) {
				expect(files).toContain(`/src/lib/assets/projects/screens/${p.slug}/${name}.jpg`);
			}
		}
	});

	it('fits its hero screenshots into its hero layout', () => {
		for (const p of projects) {
			expect(p.hero.names.length).toBeLessThanOrEqual(fans[p.hero.layout].length);
		}
	});

	it('has the detail content for every project', () => {
		for (const p of projects) {
			expect(p.about.length).toBeGreaterThan(0);
			expect(p.links.length).toBeGreaterThan(0);
			for (const link of p.links) expect(link.href).toMatch(/^https:\/\//);
			expect(p.features).toHaveLength(4);
			expect(p.stack.length).toBeGreaterThan(0);
		}
	});
});

describe('project media', () => {
	it('has a card screenshot and an app icon for every project', () => {
		const assets = Object.keys(import.meta.glob('/src/lib/assets/projects/*.{jpg,png}'));
		for (const p of projects) {
			expect(assets).toContain(`/src/lib/assets/projects/${p.slug}.jpg`);
			expect(assets).toContain(`/src/lib/assets/projects/${p.slug}-icon.png`);
		}
	});
});
