<script lang="ts">
	import { Diagram } from 'shared';
	import { project as baseProject } from '$lib/diagram/fixture';
	import { page } from '$app/stores';

	type Field = { name: string };
	type Table = { fields: Field[] };
	type Project = { schemas: { tables: Table[] }[] };

	type RerenderBench = {
		ready: boolean;
		scenario: string;
		renderer: string;
		run: (frames: number) => Promise<void>;
	};

	const renderer = ($page.url.searchParams.get('renderer') ?? 'svg') as 'svg' | 'canvas';
	const scenario = $page.url.searchParams.get('scenario') ?? 'identity';

	let show = false;

	// Mutable deep copy so scenario mutations never touch the shared fixture.
	const project = structuredClone(baseProject) as Project;
	const tables = project.schemas.flatMap((schema) => schema.tables);
	const originalFieldNames = tables.map((table) => table.fields[0]?.name ?? 'field');

	let push: ((update: Project) => void) | null = null;
	const subscribe = (callback: (update: Project) => void) => {
		push = callback;
		exposeBench();
		return () => {
			push = null;
		};
	};

	let tickCounter = 0;
	function applyScenario(i: number) {
		if (scenario === 'identity') return;
		if (scenario === 'mutate-one') {
			const table = tables[0];
			if (table?.fields[0]) table.fields[0].name = `${originalFieldNames[0]}_${i % 10}`;
			return;
		}
		if (scenario === 'mutate-all') {
			tables.forEach((table, index) => {
				if (table.fields[0]) table.fields[0].name = `${originalFieldNames[index]}_${i % 10}`;
			});
			return;
		}
		throw new Error(`Unknown scenario: ${scenario}`);
	}

	const drawFrameCount = () => performance.getEntriesByName('flitter:drawFrame').length;

	const awaitNextDrawFrame = (before: number) =>
		new Promise<void>((resolve, reject) => {
			let attempts = 0;
			const check = () => {
				if (drawFrameCount() > before) {
					resolve();
					return;
				}
				attempts += 1;
				if (attempts > 600) {
					reject(new Error('No flitter:drawFrame measure within 600 frames'));
					return;
				}
				requestAnimationFrame(check);
			};
			requestAnimationFrame(check);
		});

	async function run(frames: number) {
		if (push == null) throw new Error('Diagram is not mounted yet');
		for (let i = 0; i < frames; i += 1) {
			const before = drawFrameCount();
			applyScenario(tickCounter);
			tickCounter += 1;
			push(project);
			await awaitNextDrawFrame(before);
		}
	}

	function exposeBench() {
		const bench: RerenderBench = { ready: true, scenario, renderer, run };
		(window as unknown as { __rerenderBench: RerenderBench }).__rerenderBench = bench;
	}
</script>

<div>
	<button on:click={() => (show = !show)}>{show ? 'Hide' : 'Show'}</button>
</div>

<div class="diagram-wrapper">
	{#if show}
		<Diagram {project} {subscribe} {renderer} performanceTracing={true} />
	{/if}
</div>

<style>
	.diagram-wrapper {
		padding: 16px;
		width: 100%;
		height: 500px;
		background-color: darkgrey;
	}
</style>
