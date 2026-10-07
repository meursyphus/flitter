import { expect, test } from '@playwright/test';
import type { TextFieldBench } from '../src/lib/text-field-bench';
declare global {
	interface Window {
		__textFieldBench: TextFieldBench;
	}
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer} text input stays synchronized with controllers, selection and focus`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(
			`${test.info().project.use.baseURL ?? 'http://localhost:4173'}/performance/text-field?renderer=${renderer}`
		);
		await page.waitForFunction(() => !!window.__textFieldBench);
		const input = page.getByRole('textbox', { name: 'Message' });
		await expect(input).toHaveValue('Hello');
		await page.evaluate(() => window.__textFieldBench.focusNode.requestFocus());
		await expect(input).toBeFocused();
		await page.keyboard.type(' world');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.renderedText))
			.toBe('Hello world');
		expect(await page.evaluate(() => window.__textFieldBench.controller.text)).toBe('Hello world');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.paintedText))
			.toBe('Hello world');
		await page
			.locator('[data-testid="text-field"]')
			.screenshot({ path: test.info().outputPath('typed.png') });
		await page.keyboard.press('Shift+ArrowLeft');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.controller.selection))
			.toEqual({ start: 10, end: 11 });
		await page.keyboard.press('Enter');
		expect(await page.evaluate(() => window.__textFieldBench.submitted)).toEqual(['Hello world']);
		await page.evaluate(() => {
			window.__textFieldBench.controller.text = 'Programmatic';
		});
		await expect(input).toHaveValue('Programmatic');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.renderedText))
			.toBe('Programmatic');
		await page.evaluate(() => window.__textFieldBench.focusNode.unfocus());
		await expect(input).not.toBeFocused();
		expect(await page.evaluate(() => window.__textFieldBench.focusNode.hasFocus)).toBe(false);
		await page.mouse.click(100, 64);
		await expect(input).toBeFocused();
		await page.mouse.move(85, 64);
		await page.mouse.down();
		await page.mouse.move(145, 64, { steps: 4 });
		await page.mouse.up();
		await expect
			.poll(() =>
				page.evaluate(() => {
					const { start, end } = window.__textFieldBench.controller.selection;
					return end - start;
				})
			)
			.toBeGreaterThan(0);
		await page.evaluate(() => window.__textFieldBench.configure({ mounted: false }));
		await expect(input).toHaveCount(0);
		await page.waitForTimeout(30);
		expect(errors).toEqual([]);
	});

	test(`${renderer} uncontrolled paste and composition update visible text, preserving edits on rebuild`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(
			`${test.info().project.use.baseURL ?? 'http://localhost:4173'}/performance/text-field?renderer=${renderer}`
		);
		await page.waitForFunction(() => !!window.__textFieldBench);
		await page.evaluate(() => window.__textFieldBench.configure({ controlled: false }));
		const input = page.getByRole('textbox', { name: 'Message' });
		await input.focus();
		await input.fill('Pasted text');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.renderedText))
			.toBe('Pasted text');
		await page.evaluate(() => window.__textFieldBench.rerender());
		await expect(input).toHaveValue('Pasted text');
		await input.evaluate((element: HTMLTextAreaElement) => {
			element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
			element.value = '한글';
			element.dispatchEvent(
				new InputEvent('input', { bubbles: true, data: '글', isComposing: true })
			);
			element.dispatchEvent(
				new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', isComposing: true })
			);
			element.dispatchEvent(
				new CompositionEvent('compositionend', { bubbles: true, data: '한글' })
			);
		});
		await expect.poll(() => page.evaluate(() => window.__textFieldBench.renderedText)).toBe('한글');
		expect(await page.evaluate(() => window.__textFieldBench.submitted)).toEqual([]);
		await page.evaluate(() => window.__textFieldBench.configure({ multiline: true }));
		await input.fill('one');
		await page.keyboard.press('End');
		await page.keyboard.press('Enter');
		await page.keyboard.type('two');
		await expect(input).toHaveValue('one\ntwo');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.renderedText))
			.toBe('one\ntwo');
		await page.evaluate(() => window.__textFieldBench.configure({ mounted: false }));
		await expect(input).toHaveCount(0);
		expect(errors).toEqual([]);
	});
}
