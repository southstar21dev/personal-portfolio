import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { INTRO_SEEN_KEY, INTRO_TIMING as T } from './intro.js';

describe('intro', () => {
	it('app.html checks the same sessionStorage key the intro sets', () => {
		const html = readFileSync(new URL('../app.html', import.meta.url), 'utf8');
		expect(html).toContain(`sessionStorage.getItem('${INTRO_SEEN_KEY}')`);
	});

	it('runs its steps in order', () => {
		expect(T.ringDrawAt + T.ringDrawMs).toBeLessThanOrEqual(T.ringFillAt + T.fillMs);
		expect(T.cloudOutAt + T.cloudOutMs).toBeLessThanOrEqual(T.travelAt);
		expect(T.travelAt + T.travelMs).toBeLessThanOrEqual(T.revealAt);
		expect(T.logoOutAt + T.logoOutMs).toBeLessThanOrEqual(T.doneAt);
	});
});
