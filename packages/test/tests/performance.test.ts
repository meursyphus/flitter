/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '../src/lib/formatDate';
import { test } from '@playwright/test';
import traceJson from '../performance-history/output/2024-03-26:13:00:58.js';

test.describe('Performance', () => {
	test('Measure widget rendering time', async ({ page }) => {
		await page.goto('http://localhost:4173/performance');
		const startTime = performance.now();
		await page.click('button');
		await page.waitForSelector('svg');
		const endTime = performance.now();

		const duration = endTime - startTime;

		console.log('render duration: ', duration);
	});

	test('Get Performance Metrics', async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const client = await context.newCDPSession(page);

		await client.send('Performance.enable');

		await page.goto('http://localhost:4173/performance');
		await page.click('button');
		await page.waitForSelector('svg');
		console.log('=============CDP Performance Metrics===============');
		const performanceMetrics = await client.send('Performance.getMetrics');

		console.log(performanceMetrics.metrics);
	});

	test('Capture performance traces by marking actions using Performance API', async ({
		page,
		browser
	}) => {
		console.log('========== Start Tracing Perf ===========');
		await browser.startTracing(page, {
			path: `./performance-history/${formatDate(new Date())}.json`,
			screenshots: true,
			categories: ['disabled-by-default-v8.cpu_profiler']
		});

		await page.goto('http://localhost:4173/performance');

		//Using Performance.mark API
		await page.evaluate(() => window.performance.mark('Perf:Started'));
		await page.click('button');
		await page.waitForSelector('svg');
		//Using performance.mark API
		await page.evaluate(() => window.performance.mark('Perf:Ended'));
		//Performance measure
		await page.evaluate(() => window.performance.measure('overall', 'Perf:Started', 'Perf:Ended'));

		//To get all performance marks
		const getAllMarksJson = await page.evaluate(() =>
			JSON.stringify(window.performance.getEntriesByType('mark'))
		);
		const getAllMarks = await JSON.parse(getAllMarksJson);
		console.log('window.performance.getEntriesByType("mark")', getAllMarks);

		//To get all performance measures of Google
		const getAllMeasuresJson = await page.evaluate(() =>
			JSON.stringify(window.performance.getEntriesByType('measure'))
		);
		const getAllMeasures = await JSON.parse(getAllMeasuresJson);
		console.log('window.performance.getEntriesByType("measure")', getAllMeasures);

		console.log('======= Stop Tracing ============');
		await browser.stopTracing();
	});

	test('js execution time', async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const client = await context.newCDPSession(page);

		await client.send('Tracing.start', {
			categories: 'devtools.timeline',
			transferMode: 'ReturnAsStream'
		});

		await page.goto('http://localhost:4173/performance');
		await page.click('button');
		await page.waitForSelector('svg');
		await client.send('Tracing.end');
		console.log('=============CDP Performance Metrics===============');

		const traceData = await new Promise((resolve) => {
			client.once('Tracing.tracingComplete', async (data) => {
				const stream = data.stream!;
				const chunks = [];
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let chunk: any = '';
				while ((chunk = await client.send('IO.read', { handle: stream }))) {
					if (chunk.eof) {
						await client.send('IO.close', { handle: stream });
						break;
					}
					chunks.push(chunk.data);
				}
				resolve(chunks.join(''));
			});
		});

		console.log(traceData);
	});

	test('temp', () => {
		const flattenTasks = (tasks: any) => {
			return tasks.reduce((acc: any, task: any) => {
				acc.push(task);
				if (task.children && task.children.length) {
					acc.push(...flattenTasks(task.children));
				}
				return acc;
			}, []);
		};

		const tasks = traceJson.tasks;
		const flatTasks = flattenTasks(tasks);
		flatTasks.sort((a: any, b: any) => b.duration - a.duration);
		console.log(
			flatTasks
				.filter((task: any) => task.event.name === 'FunctionCall')
				.splice(0, 10)
				.map((task: any) => ({
					duration: task.duration,
					selfTime: task.selfTime,
					name: task.event.name,
					attr: task.metadata.attribution,
					children: task.children[0]
				}))
		);
	});
});
