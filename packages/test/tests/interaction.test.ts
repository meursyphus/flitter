import { test, expect, type Page } from '@playwright/test';

async function click(page: Page) {
	const svgElement = page.locator('svg');
	const boundingBox = await svgElement.boundingBox();
	if (boundingBox) {
		await page.mouse.click(boundingBox.x + boundingBox.width - 10, boundingBox.y + 10);
	}
}

test.describe('Interaction', () => {
	test('number change when button is clicked', async ({ page }) => {
		await page.goto('http://localhost:4173/interaction/number-change-on-click');
		await click(page);
		const target = page.getByText('1');
		await expect(target).toBeVisible();
	});

	test('number change when nested button clicked with bubbling', async ({ page }) => {
		await page.goto('http://localhost:4173/interaction/bubbling-on-nest-child-click');
		await click(page);
		const target = page.getByText('1');
		await expect(target).toBeVisible();
	});

	test('number does not change when nested button clicked with stopping bubbling', async ({
		page
	}) => {
		await page.goto('http://localhost:4173/interaction/stop-bubbling-on-nest-child-click');
		await click(page);
		const target = page.getByText('0');
		await expect(target).toBeVisible();
	});

	test('show tooltip on only hover', async ({ page }) => {
		await page.goto('http://localhost:4173/interaction/hover-effect');
		const svgElement = page.locator('svg');
		const boundingBox = await svgElement.boundingBox();
		if (boundingBox) {
			await page.mouse.move(
				boundingBox.x + boundingBox.width / 2,
				boundingBox.y + boundingBox.height / 2
			);
		}
		await expect(page.getByText('tooltip')).toBeVisible();

		//mouse leave
		await page.mouse.move(-500, -500, { steps: 5 });
		await expect(page.getByText('tooltip')).not.toBeVisible();
	});

	test('setState work on postCallbackFrame', async ({ page }) => {
		await page.goto('http://localhost:4173/interaction/set-state-on-post-frame-callback');
		await click(page);
		const target = page.getByText('1');
		await expect(target).toBeVisible();
	});
});
