<script lang="ts">
	import Widget from '@flitterjs/svelte';
	import Diagram from './widget/Diagram';
	import type { Project } from './type';

	type Subscribe = (callback: (project: Project) => void) => () => void;

	export let project: Project;
	export let subscribe: Subscribe = () => () => {};
	export let performanceTracing = false;
	export let renderer: 'svg' | 'canvas' = 'svg';
</script>

<Widget
	widget={Diagram({ project, subscribe })}
	width="100%"
	height="100%"
	performanceTracing={performanceTracing}
	{renderer}
/>

<style>
	:global(svg text) {
		user-select: none;
	}
</style>
