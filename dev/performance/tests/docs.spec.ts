import { expect, test } from '@playwright/test';

for (const route of ['/advanced/what-is-flitter/', '/chart/', '/diagram/']) {
	test(`${route} mobile navigation closes above the sticky header`, async ({ page }) => {
		await page.goto(route, { waitUntil: 'networkidle' });
		const trigger = page.getByRole('button', { name: 'Open sidebar navigation' });
		const drawer = page.getByRole('dialog', { name: 'Navigation', exact: true });
		await trigger.tap();
		await expect(drawer).toBeVisible();
		await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

		// This button was underneath the header, which intercepted mobile taps.
		await drawer.getByRole('button', { name: 'Close sidebar' }).tap();
		await expect(drawer).not.toBeVisible();
		await expect(trigger).toBeFocused();
		await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');

		await trigger.tap();
		await expect(drawer).toBeVisible();
		await page.touchscreen.tap(370, 100);
		await expect(drawer).not.toBeVisible();
		await trigger.tap();
		await expect(drawer).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(drawer).not.toBeVisible();

		await trigger.tap();
		const link = drawer.getByRole('link').last();
		const href = await link.getAttribute('href');
		await link.tap(); // Also checks that the bottom of a long menu is reachable.
		await expect(drawer).not.toBeVisible();
		await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(href?.replace(/\/$/, ''));
	});
}

test('mobile site menu closes on the current link and when switching to desktop', async ({ page }) => {
	await page.goto('/chart/', { waitUntil: 'networkidle' });
	const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
	const drawer = page.getByRole('dialog', { name: 'Menu', exact: true });
	await trigger.tap();
	await drawer.getByRole('link', { name: 'Chart', exact: true }).tap();
	await expect(drawer).not.toBeVisible();
	await trigger.tap();
	await drawer.getByRole('button', { name: 'Close menu', exact: true }).tap();
	await expect(trigger).toBeFocused();
	await trigger.tap();
	await expect(drawer).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });
	await expect(drawer).not.toBeVisible();
	await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
	await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});

test('text input stays editable across Canvas, SVG and theme changes', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	const demo = page.getByTestId('hero-text-input');
	const input = page.getByRole('textbox', { name: 'Try typing here' });
	const stage = demo.locator('[data-renderer]');
	await expect(input).toHaveValue('Make it yours.');
	await stage.scrollIntoViewIfNeeded();
	const bounds = (await stage.boundingBox())!;
	await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
	await expect(input).toBeFocused();
	await input.fill('안녕, Flitter ✨');
	await demo.getByRole('button', { name: 'SVG', exact: true }).tap();
	await expect(stage.locator('svg')).toBeVisible();
	await expect(stage.locator('canvas')).toHaveCount(0);
	await expect(input).toHaveValue('안녕, Flitter ✨');
	await expect(stage.locator('svg')).toContainText('안녕, Flitter ✨');
	await input.fill('Draw your words');
	await expect(stage.locator('svg')).toContainText('Draw your words');

	await demo.getByRole('button', { name: 'Canvas', exact: true }).tap();
	const canvas = stage.locator('canvas');
	await expect(canvas).toBeVisible();
	await expect(stage.locator('svg')).toHaveCount(0);
	await expect(input).toHaveValue('Draw your words');
	const before = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
	await input.fill('Still editable');
	await expect.poll(() => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).not.toBe(before);
	await page.getByRole('button', { name: 'Switch color theme' }).tap();
	await expect(input).toHaveValue('Still editable');
	await demo.getByRole('button', { name: 'SVG', exact: true }).tap();
	await expect(stage.locator('svg')).toContainText('Still editable');
	await expect(input).toHaveCount(1);
	await demo.locator('summary').tap();
	await expect(demo.locator('pre')).toContainText('export default function TextInput');
	await expect.poll(() => page.evaluate(() =>
		document.documentElement.scrollWidth <= window.innerWidth
	)).toBe(true);
	expect(errors).toEqual([]);
});
