<script lang="ts">
	import { Diagram } from 'shared';
	import { project } from '$lib/diagram/fixture';
	import { onMount } from 'svelte';

	let show = false;
	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});

	function toggle() {
		show = !show;
	}

	const handleClick = () => {
		toggle();
	};
</script>

<div>
	<button disabled={!hydrated} on:click={handleClick}>{show ? 'Hide' : 'Show'}</button>
</div>

<div class="diagram-wrapper">
	{#if show}
		<Diagram {project} performanceTracing={true} />
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
