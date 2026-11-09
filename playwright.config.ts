import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		// Locally, reuse a running preview; in CI always test a fresh build.
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests',
	testMatch: '**/*.e2e.{ts,js}',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
	// WebKit too: motion.ts, the screenshot rows and the intro have Safari-specific paths.
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } }
	]
});
