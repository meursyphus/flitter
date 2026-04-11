import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Button Test', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:4173');
	});

	test('should toggle between light and dark themes', async ({ page }) => {
		const toggleButton = await page.locator('#theme-toggle-button');
		const htmlElement = await page.locator('html');

		await toggleButton.click();
		await expect(htmlElement).toHaveClass(/dark/);

		await page.reload();

		await expect(htmlElement).toHaveClass(/dark/);

		await toggleButton.click();
		await expect(htmlElement).not.toHaveClass(/dark/);

		await page.reload();

		await expect(htmlElement).not.toHaveClass(/dark/);
	});
});
