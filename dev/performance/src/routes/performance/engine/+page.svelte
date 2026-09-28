<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		engineScenarios,
		mountEngineBench,
		type EngineScenario,
		type EngineBench
	} from '$lib/engine-bench';
	let host: HTMLDivElement;
	onMount(() => {
		const renderer = $page.url.searchParams.get('renderer') === 'svg' ? 'svg' : 'canvas';
		const scenario = ($page.url.searchParams.get('scenario') ?? 'identity') as EngineScenario;
		if (!engineScenarios.includes(scenario)) throw new Error(`Unknown scenario ${scenario}`);
		const bench = mountEngineBench(host, renderer, scenario);
		(window as unknown as { __engineBench: EngineBench }).__engineBench = bench;
		return () => bench.dispose();
	});
</script>

<div bind:this={host} data-testid="engine" style="width:960px;height:540px;background:white"></div>
