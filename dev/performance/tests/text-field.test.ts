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

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer} long editable text scrolls and preserves grapheme selections`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`/performance/text-field?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.__textFieldBench);
		const input = page.getByRole('textbox', { name: 'Message' });
		const value = 'BEGIN ' + 'wide words '.repeat(15) + 'END😀';
		await page.evaluate((text) => {
			window.__textFieldBench.controller.text = text;
			window.__textFieldBench.focusNode.requestFocus();
		}, value);
		await expect(input).toBeFocused();
		await expect.poll(() => page.evaluate(() => window.__textFieldBench.paintedText)).toBe(value);
		const viewport = await page.evaluate(() => window.__textFieldBench.viewportBounds);
		await expect
			.poll(async () => {
				const caret = (await input.boundingBox())!;
				return caret.x >= viewport.x && caret.x + caret.width <= viewport.x + viewport.width + 1;
			})
			.toBe(true);
		const endImage = await page
			.locator('[data-testid="text-field"]')
			.screenshot({ path: test.info().outputPath('long-end.png') });
		await page.keyboard.press('Shift+ArrowLeft');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.controller.selection))
			.toEqual({ start: value.length - 2, end: value.length });
		await page.evaluate(() => {
			window.__textFieldBench.focusNode.unfocus();
			window.__textFieldBench.controller.selection = { start: 0, end: 5 };
			window.__textFieldBench.focusNode.requestFocus();
		});
		await expect(input).toBeFocused();
		await expect
			.poll(() => input.evaluate((el: HTMLTextAreaElement) => [el.selectionStart, el.selectionEnd]))
			.toEqual([0, 5]);
		const startImage = await page
			.locator('[data-testid="text-field"]')
			.screenshot({ path: test.info().outputPath('long-start.png') });
		expect(startImage.equals(endImage)).toBe(false);
		await page.keyboard.type('START');
		await expect(input).toHaveValue('START' + value.slice(5));
		await page.evaluate(() => {
			const { controller } = window.__textFieldBench;
			controller.selection = { start: controller.text.length, end: controller.text.length };
		});
		await page.waitForTimeout(40);
		await page.mouse.click(viewport.x + viewport.width - 2, viewport.y + 8);
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.controller.selection.end))
			.toBeGreaterThan(value.length - 4);
		expect(errors).toEqual([]);
	});

	test(`${renderer} multiline viewport retains and scrolls the whole document`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`/performance/text-field?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.__textFieldBench);
		await page.evaluate(() => window.__textFieldBench.configure({ multiline: true }));
		const input = page.getByRole('textbox', { name: 'Message' });
		const value = Array.from({ length: 12 }, (_, i) => `Line ${i} 😀`).join('\n');
		await page.evaluate((text) => {
			window.__textFieldBench.controller.text = text;
			window.__textFieldBench.focusNode.requestFocus();
		}, value);
		await expect(input).toHaveValue(value);
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.paintedText))
			.toBe(value.replace(/\n/g, ''));
		const viewport = await page.evaluate(() => window.__textFieldBench.viewportBounds);
		expect(viewport.height).toBeCloseTo(18 * 1.2 * 4);
		await expect
			.poll(async () => {
				const caret = (await input.boundingBox())!;
				return caret.y >= viewport.y && caret.y + caret.height <= viewport.y + viewport.height + 1;
			})
			.toBe(true);
		const endImage = await page
			.locator('[data-testid="text-field"]')
			.screenshot({ path: test.info().outputPath('multiline-end.png') });
		await page.evaluate(() => {
			window.__textFieldBench.controller.selection = { start: 0, end: 0 };
		});
		await expect.poll(async () => (await input.boundingBox())!.y).toBeCloseTo(viewport.y, 0);
		const startImage = await page
			.locator('[data-testid="text-field"]')
			.screenshot({ path: test.info().outputPath('multiline-start.png') });
		expect(startImage.equals(endImage)).toBe(false);
		expect(errors).toEqual([]);
	});

	test(`${renderer} replacement handles detach old owners without disposing them`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`/performance/text-field?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.__textFieldBench);
		const input = page.getByRole('textbox', { name: 'Message' });
		await page.evaluate(() => window.__textFieldBench.focusNode.requestFocus());
		await expect(input).toBeFocused();
		await page.evaluate(() => window.__textFieldBench.replaceHandles());
		await expect(input).toHaveValue('Replacement');
		expect(await page.evaluate(() => window.__textFieldBench.focusNode.hasFocus)).toBe(false);
		expect(await page.evaluate(() => window.__textFieldBench.activeFocusNode.hasFocus)).toBe(true);
		await page.evaluate(() => {
			window.__textFieldBench.controller.text = 'Detached';
			window.__textFieldBench.focusNode.unfocus();
		});
		await expect(input).toHaveValue('Replacement');
		await expect(input).toBeFocused();
		await page.evaluate(() => window.__textFieldBench.activeFocusNode.unfocus());
		await expect(input).not.toBeFocused();
		await page.evaluate(() => window.__textFieldBench.focusNode.requestFocus());
		await expect(input).not.toBeFocused();
		await page.evaluate(() => window.__textFieldBench.activeFocusNode.requestFocus());
		await expect(input).toBeFocused();
		await page.evaluate(() => window.__textFieldBench.configure({ mounted: false }));
		await expect(input).toHaveCount(0);
		expect(await page.evaluate(() => window.__textFieldBench.activeFocusNode.hasFocus)).toBe(false);
		await page.evaluate(() => {
			window.__textFieldBench.activeController.text = 'Still caller owned';
		});
		expect(errors).toEqual([]);
	});

	test(`${renderer} a shorter unfocused value is revealed after scrolling`, async ({ page }) => {
		await page.goto(`/performance/text-field?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.__textFieldBench);
		const input = page.getByRole('textbox', { name: 'Message' });
		await page.evaluate(() => {
			window.__textFieldBench.controller.text = 'very long text '.repeat(40);
			window.__textFieldBench.focusNode.requestFocus();
		});
		await expect(input).toBeFocused();
		await page.waitForTimeout(40);
		await page.evaluate(() => {
			window.__textFieldBench.focusNode.unfocus();
			window.__textFieldBench.controller.text = 'Short';
		});
		await expect(input).not.toBeFocused();
		await expect(input).toHaveValue('Short');
		await page.waitForTimeout(40);
		const short = await page.locator('[data-testid="text-field"]').screenshot();
		await page.evaluate(() => {
			window.__textFieldBench.controller.text = '';
		});
		await expect(input).toHaveValue('');
		const empty = await page.locator('[data-testid="text-field"]').screenshot();
		expect(short.equals(empty)).toBe(false);
		await page.evaluate(() => {
			window.__textFieldBench.controller.text = 'Short';
			window.__textFieldBench.focusNode.requestFocus();
		});
		await expect(input).toBeFocused();
		const viewport = await page.evaluate(() => window.__textFieldBench.viewportBounds);
		await expect.poll(async () => (await input.boundingBox())!.x).toBeLessThan(viewport.x + 100);
	});

	test(`${renderer} unfocus cancels a focus request before the next frame`, async ({ page }) => {
		await page.goto(`/performance/text-field?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.__textFieldBench);
		const input = page.getByRole('textbox', { name: 'Message' });
		await page.evaluate(async () => {
			window.__textFieldBench.focusNode.requestFocus();
			window.__textFieldBench.focusNode.unfocus();
			await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		});
		await expect(input).not.toBeFocused();
		expect(await page.evaluate(() => window.__textFieldBench.focusNode.hasFocus)).toBe(false);
	});
}

for (const renderer of ['svg', 'canvas']) {
	test(`${renderer} a pending replacement focus preserves the replacement controller value`, async ({
		page
	}) => {
		await page.goto(`/performance/text-field?renderer=${renderer}`);
		await page.waitForFunction(() => !!window.__textFieldBench);
		const input = page.getByRole('textbox', { name: 'Message' });
		await page.evaluate(() => {
			const bench = window.__textFieldBench;
			bench.controller.text = 'Original';
			bench.replaceHandles();
			bench.activeController.selection = { start: 1, end: 4 };
			bench.activeFocusNode.requestFocus();
		});
		await expect(input).toBeFocused();
		await expect(input).toHaveValue('Replacement');
		await expect
			.poll(() => page.evaluate(() => window.__textFieldBench.renderedText))
			.toBe('Replacement');
		expect(await page.evaluate(() => window.__textFieldBench.activeController.value)).toEqual({
			text: 'Replacement',
			selection: { start: 1, end: 4 }
		});
		expect(
			await input.evaluate((el: HTMLTextAreaElement) => [el.selectionStart, el.selectionEnd])
		).toEqual([1, 4]);
	});
}
