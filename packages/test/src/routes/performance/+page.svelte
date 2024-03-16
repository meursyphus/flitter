<script lang="ts">
	import { Text, type Widget, Center } from '@meursyphus/flitter';
	import SvelteWidget from '@meursyphus/flitter-svelte';
	import Diagram from '$lib/diagram/Diagram.svelte';
	let show = false;

	function toggle() {
		show = !show;
	}
	function wait(ms: number) {
		const end = Date.now() + ms;
		while (Date.now() < end) continue;
	}
	function test(n = 0) {
		for (let i = 0; i < 10 ** 3; ++i) {
			setTimeout(() => {}, 0);
			temp();
			temp();
			temp();
		}
		// if (n === 10 ** 3) return;
		// setTimeout(temp, 300);
	}
	function temp() {}

	const handleClick = () => {
		toggle();
	};
</script>

<div>
	<button on:click={handleClick}>{show ? 'Hide' : 'Show'}</button>
</div>

<div class="diagram-wrapper">
	{#if show}
		<Diagram />
	{/if}
</div>

<style>
	.diagram-wrapper {
		padding: 16px;
		width: 100%;
		height: 500px;
	}
</style>
