/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test } from '@playwright/test';

test.describe('Performance', () => {
	test('runApp method must be under 70ms', async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const client = await context.newCDPSession(page);

		await client.send('Tracing.start', {
			categories: 'devtools.timeline,disabled-by-default-v8.cpu_profiler',
			transferMode: 'ReturnAsStream'
		});

		await page.goto('http://localhost:4173/performance');
		await page.getByText('Show').click();
		await page.waitForSelector('svg');
		await client.send('Tracing.end');

		const traceData: any = await new Promise((resolve) => {
			client.once('Tracing.tracingComplete', async (data) => {
				const stream = data.stream!;
				const chunks = [];
				let chunk: any = '';
				while ((chunk = await client.send('IO.read', { handle: stream }))) {
					if (chunk.eof) {
						await client.send('IO.close', { handle: stream });
						break;
					}
					chunks.push(JSON.parse(chunk.data));
				}
				resolve(chunks);
			});
		});

		const [{ traceEvents }] = traceData;
		const profileChunks = traceEvents.filter((entry: any) => entry.name === 'ProfileChunk');
		const nodes = profileChunks
			.map((entry: any) => entry.args.data.cpuProfile.nodes)
			.flat()
			.sort((a: any, b: any) => a.id - b.id);
		const runApp = nodes.find((node: any) => node.callFrame.functionName === 'runApp');
		const mount = nodes.find((node: any) => node.callFrame.functionName === 'mount');
		const draw = nodes.find((node: any) => node.callFrame.functionName === 'draw');
		const sampleTimes: Record<number, number> = {};

		profileChunks.forEach((chunk: any) => {
			const {
				cpuProfile: { samples },
				timeDeltas
			} = chunk.args.data as {
				cpuProfile: {
					samples: number[];
				};
				timeDeltas: number[];
			};

			samples.forEach((id, index) => {
				const delta = timeDeltas[index];
				const time = sampleTimes[id] ?? 0;
				sampleTimes[id] = time + delta;
			});
		});
		interface TreeNode {
			id: number;
			parent?: number;
			children: TreeNode[];
			duration: number;
		}

		const treeNodes: TreeNode[] = nodes;

		const nodesMap = new Map<number, TreeNode>();
		treeNodes.forEach((node) => {
			if (node == null) return;
			node.children = [];
			node.duration = sampleTimes[node.id] ?? 0;
			nodesMap.set(node.id, node);
		});

		treeNodes.sort((a, b) => b.id - a.id);
		treeNodes.forEach((node) => {
			if (node == null) return;
			if (node.parent == null) return;
			const parentNode = nodesMap.get(node.parent);
			if (parentNode) {
				parentNode.children.push(node);
				parentNode.duration += node.duration;
			}
		});

		console.log(`runApp execution time: ${(runApp.duration / 1000).toFixed(2)}ms`);
		console.log(`mount execution time: ${(mount.duration / 1000).toFixed(2)}ms`);
		console.log(`draw execution time: ${(draw.duration / 1000).toFixed(2)}ms`);

		expect(runApp.duration).toBeLessThan(70 * 1000);
	});
});
