import { expect, test } from '@playwright/test';
import { INTRO_TIMING } from '../src/lib/intro.ts';
import { resume } from '../src/lib/site.ts';

test.describe('hero', () => {
	test('shows the name, logo and section links', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1, name: 'ZIYA SHARIFLI' })).toBeVisible();
		await expect(page.getByRole('img', { name: 'ZS logo' })).toBeVisible();
		const nav = page.getByRole('navigation', { name: 'Primary' });
		await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
		await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
	});
});

test.describe('logo intro', () => {
	test('plays once per session', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-intro', 'play');
		// Draw → fill → glide → reveal, then the splash removes itself.
		await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/, {
			timeout: INTRO_TIMING.doneAt + 3000
		});
		await expect(page.getByTestId('splash')).toHaveCount(0);

		await page.reload();
		await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);
	});

	test('is skipped for reduced motion', async ({ browser }) => {
		const context = await browser.newContext({ reducedMotion: 'reduce' });
		const page = await context.newPage();
		await page.goto('/');
		await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await context.close();
	});

	test('is skipped when the visit starts on a section link', async ({ page }) => {
		await page.goto('/#projects');
		await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);
		await expect(page.getByRole('heading', { level: 2, name: 'PROJECTS' })).toBeInViewport();
	});
});

test.describe('about', () => {
	test('sits between the hero and the projects, with photo and facts', async ({ page }) => {
		await page.goto('/');
		const about = page.locator('#about');
		await expect(about.getByRole('heading', { level: 2, name: 'ABOUT ME' })).toBeAttached();
		await expect(about.getByRole('img', { name: 'Ziya Sharifli' })).toBeAttached();
		await expect(about.locator('dt')).toHaveText([
			'Studying',
			'Background',
			'Based in',
			'Languages'
		]);
		const order = await page.locator('main > section').evaluateAll((s) => s.map((e) => e.id));
		expect(order.indexOf('about')).toBe(1);
		expect(order.indexOf('projects')).toBe(2);
	});
});

test.describe('contact', () => {
	test('shows the email, links and footer', async ({ page }) => {
		await page.goto('/#contact');
		const contact = page.locator('#contact');
		await expect(contact.getByRole('heading', { level: 2, name: 'CONTACT' })).toBeInViewport();
		await expect(contact.getByRole('link', { name: 'contact@ziyasharifli.dev' })).toHaveAttribute(
			'href',
			'mailto:contact@ziyasharifli.dev'
		);
		await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
			'href',
			'https://github.com/southstar21dev'
		);
		await expect(contact.getByRole('link', { name: /Instagram/ })).toHaveAttribute(
			'href',
			'https://www.instagram.com/ziyasharifli.dev/'
		);
		await expect(page.getByRole('contentinfo')).toContainText('Ziya Sharifli');
		await expect(page.getByRole('link', { name: /Back to top/ })).toHaveAttribute('href', '#top');
	});

	test('the resume opens as a PDF in a new tab', async ({ page, request }) => {
		await page.goto('/#contact');
		const link = page.locator('#contact').getByRole('link', { name: /^Resume/ });
		await expect(link).toHaveAttribute('href', resume);
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).not.toHaveAttribute('download');
		const res = await request.get(resume);
		expect(res.ok()).toBe(true);
		expect(res.headers()['content-type']).toContain('application/pdf');
		// Nothing forces a download, so the browser shows it in its PDF viewer.
		expect(res.headers()['content-disposition'] ?? '').not.toContain('attachment');
	});
});

test.describe('projects', () => {
	test('the Projects link scrolls down to the projects', async ({ browser }) => {
		const context = await browser.newContext({ reducedMotion: 'reduce' });
		const page = await context.newPage();
		await page.goto('/');
		await page
			.getByRole('navigation', { name: 'Primary' })
			.getByRole('link', { name: 'Projects' })
			.click();
		await expect(page.getByRole('heading', { level: 2, name: 'PROJECTS' })).toBeInViewport();
		await expect(page).toHaveURL(/#projects$/);
		await context.close();
	});

	test('lists the six projects with their previews', async ({ page }) => {
		await page.goto('/#projects');
		const section = page.locator('#projects');
		await expect(section.getByRole('heading', { level: 3 })).toHaveText([
			'Harada Media',
			'Kaloria',
			'Mirkazim Media',
			'Droidtosh',
			'Volum',
			'Vectra'
		]);
		await expect(section.getByRole('img', { name: 'Volum screenshot' })).toBeVisible();
	});
});

test.describe('project detail', () => {
	// Reduced motion: the cards stop bobbing (so they can be clicked) and the sheet opens instantly.
	test.use({ reducedMotion: 'reduce' });

	test('opens from a card, flips through projects and closes with Back', async ({ page }) => {
		await page.goto('/#projects');
		await page
			.locator('#projects')
			.getByRole('link', { name: /^Kaloria screenshot/ })
			.click();

		const dialog = page.getByRole('dialog', { name: 'KALORIA' });
		await expect(dialog).toBeVisible();
		await expect(page).toHaveURL(/#kaloria$/);
		await expect(dialog.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
			'href',
			'https://github.com/southstar21dev/Kaloria'
		);
		await expect(dialog.getByRole('region', { name: 'The app screenshots' })).toBeAttached();
		await expect(dialog.getByRole('heading', { name: 'WHAT IT DOES' })).toBeAttached();

		await dialog.getByRole('button', { name: 'Next project: Mirkazim Media' }).click();
		await expect(page.getByRole('dialog', { name: 'MIRKAZIM MEDIA' })).toBeVisible();
		await expect(page).toHaveURL(/#mirkazim$/);

		// The pair at the bottom of the panel flips both ways.
		const mirkazim = page.getByRole('dialog', { name: 'MIRKAZIM MEDIA' });
		await mirkazim.getByRole('button', { name: /^Previous project KALORIA/ }).click();
		await expect(page.getByRole('dialog', { name: 'KALORIA' })).toBeVisible();
		await page
			.getByRole('dialog', { name: 'KALORIA' })
			.getByRole('button', { name: /^Next project MIRKAZIM MEDIA/ })
			.click();
		await expect(page).toHaveURL(/#mirkazim$/);

		await page.goBack();
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page).toHaveURL(/#projects$/);
	});

	test('website projects show their admin panel', async ({ page }) => {
		await page.goto('/#harada');
		const dialog = page.getByRole('dialog', { name: 'HARADA MEDIA' });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('region', { name: 'Admin panel screenshots' })).toBeAttached();
		await expect(dialog.getByRole('region', { name: 'Public site screenshots' })).toBeAttached();
	});

	test('screenshot rows page with their arrow buttons', async ({ page }) => {
		await page.goto('/#mirkazim');
		const dialog = page.getByRole('dialog', { name: 'MIRKAZIM MEDIA' });
		const row = dialog.getByRole('region', { name: 'Admin panel screenshots' });
		const back = dialog.getByRole('button', { name: 'Scroll Admin panel screenshots back' });
		const forward = dialog.getByRole('button', { name: 'Scroll Admin panel screenshots forward' });
		await row.scrollIntoViewIfNeeded();
		await expect(back).toBeDisabled();
		await forward.click();
		await expect.poll(() => row.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
		await expect(back).toBeEnabled();
		await back.click();
		await expect.poll(() => row.evaluate((el) => el.scrollLeft)).toBe(0);
	});

	test('a shared link opens the project, and Esc closes it', async ({ page }) => {
		await page.goto('/#droidtosh');
		const dialog = page.getByRole('dialog', { name: 'DROIDTOSH' });
		await expect(dialog).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page).not.toHaveURL(/#droidtosh/);
		await expect(page.getByRole('heading', { level: 2, name: 'PROJECTS' })).toBeInViewport();
	});
});

test.describe('project detail with motion', () => {
	test('closes, reopens mid-close and never leaves the page locked', async ({ page }) => {
		await page.goto('/#projects');
		const html = page.locator('html');
		// The cards bob forever with motion on, so they never count as "stable": force the click.
		await page
			.locator('#projects')
			.getByRole('link', { name: /^Kaloria screenshot/ })
			.click({ force: true });
		const dialog = page.getByRole('dialog', { name: 'KALORIA' });
		await expect(dialog).toBeVisible();
		await expect(html).toHaveCSS('overflow', 'hidden');

		// Close (it slides out for a moment), and come straight back with Forward mid-slide.
		await dialog.getByRole('button', { name: 'Close' }).click();
		await expect(page).toHaveURL(/#projects$/);
		await page.goForward();
		await expect(page).toHaveURL(/#kaloria$/);
		await expect(dialog).toBeVisible();

		// Reopened from history, closing still steps back rather than rewriting the URL.
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(page).toHaveURL(/#projects$/);
		expect(await html.evaluate((el) => el.style.overflow)).toBe('');
	});
});
