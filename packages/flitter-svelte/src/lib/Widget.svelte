<script lang="ts">
	import { onMount } from 'svelte';
	import { parseHTML } from 'linkedom';
	import { type Widget, Alignment, AppRunner, Container, Text } from '@meursyphus/flitter';
	const browser = typeof window !== 'undefined';

	export let renderer: 'svg' | 'canvas' = 'svg';
	export let widget: Widget = Container({
		width: Infinity,
		height: Infinity,
		alignment: Alignment.center,
		child: Text('implement widget here')
	});

	export let ssr:
		| {
				size: {
					width: number;
					height: number;
				};
		  }
		| undefined = undefined;
	export let width = '100%';
	export let height = '300px';

	let renderEl: SVGSVGElement | HTMLCanvasElement;
	let containerEl: HTMLElement;
	let runner: AppRunner;
	let innerHTML: string = '';
	if (!browser) {
		const { document: _document, window: _window } = parseHTML(`<svg></svg>`);
		const _svg = _document.querySelector('svg')!;
		runner = new AppRunner({
			view: _svg,
			window: _window,
			document: _document,
			ssrSize: ssr?.size
		});
		innerHTML = runner.runApp(widget);
	}

	onMount(() => {
		runner = new AppRunner({
			view: renderEl,
			window: window,
			document: document,
			ssrSize: ssr?.size
		});
		renderEl.innerHTML = '';
		runner.runApp(widget);
		runner.onMount({
			resizeTarget: containerEl
		});

		return () => {
			runner.dispose();
		};
	});
</script>

<div bind:this={containerEl} style="--width: {width}; --height: {height}">
	{#if renderer === 'canvas' && browser}
		<canvas class="flitter" bind:this={renderEl} />
	{:else}
		<svg class="flitter" bind:this={renderEl}>
			{@html innerHTML}
		</svg>
	{/if}
</div>

<style>
	div {
		width: var(--width);
		height: var(--height);
	}
	.flitter {
		width: 100%;
		height: 100%;
	}
</style>
