import { test, expect } from '@playwright/test';

test.describe('Interaction', () => {
	test('number change when button is clicked', async ({ page }) => {
		await page.goto('http://localhost:4173/interaction/number-change-on-click');
		const button = page.locator('rect');
		await button.click();
		const target = page.getByText('1');
		await expect(target).toBeVisible();
	});

	test('number change when nested button clicked with bubbling', async ({ page }) => {
		await page.goto('http://localhost:4173/interaction/bubbling-on-nest-child-click');
		const nested = page.locator('rect').last();
		await nested.click();
		const target = page.getByText('1');
		await expect(target).toBeVisible();
	});

	test('number does not change when nested button clicked with stopping bubbling', async ({
		page
	}) => {
		await page.goto('http://localhost:4173/interaction/stop-bubbling-on-nest-child-click');
		const button = page.locator('rect').last();
		await button.click();
		const target = page.getByText('0');
		await expect(target).toBeVisible();
	});
});
