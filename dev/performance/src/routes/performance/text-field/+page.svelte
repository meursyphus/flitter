<script lang="ts">
	import { onMount } from 'svelte';
	import { mountTextFieldBench, type TextFieldBench } from '$lib/text-field-bench';
	let host: HTMLDivElement;
	onMount(() => {
		const bench = mountTextFieldBench(
			host,
			new URL(window.location.href).searchParams.get('renderer') === 'svg' ? 'svg' : 'canvas'
		);
		(window as unknown as { __textFieldBench: TextFieldBench }).__textFieldBench = bench;
		return () => bench.dispose();
	});
</script>

<div bind:this={host} data-testid="text-field" style="width:480px;height:240px"></div>
