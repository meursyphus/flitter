import { test, expect } from '@playwright/test';

test('number change when button is clicked', async ({ page }) => {
	await page.goto('http://localhost:4173/interaction/number-change-on-click');
	const button = page.locator('rect');
	await button.click();
	const target = page.getByText('1');
	await expect(target).toBeVisible();
});
