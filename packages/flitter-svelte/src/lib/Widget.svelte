<script lang="ts">
	import { onMount } from 'svelte';
	import { type Widget, Alignment, AppRunner, Container, Text } from '@meursyphus/flitter';

	export let widget: Widget = Container({
		width: Infinity,
		height: Infinity,
		alignment: Alignment.center,
		child: Text('implement widget here')
	});

	export let ssrSize: { width: number; height: number } | undefined = undefined;
	export let width = '100%';
	export let height = '300px';

	let svgEl: SVGSVGElement;
	let containerEl: HTMLElement;
	onMount(() => {
		const runner = new AppRunner({
			view: svgEl,
			window: window,
			document: document,
			ssrSize
		});
		runner.runApp(widget);
		runner.onMount({
			resizeTarget: containerEl
		});
	});
</script>

<div bind:this={containerEl} style="--width: {width}; --height: {height}">
	<svg bind:this={svgEl} />
</div>

<style>
	div {
		width: var(--width);
		height: var(--height);
	}
	svg {
		width: 100%;
		height: 100%;
	}
</style>
