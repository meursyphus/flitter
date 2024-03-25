<script lang="ts">
	import Diagram from '$lib/diagram/Diagram.svelte';
	import { project } from '$lib/diagram/fixture';
	let show = false;

	function toggle() {
		show = !show;
	}

	const handleClick = () => {
		toggle();
	};
</script>

<div>
	<button on:click={handleClick}>{show ? 'Hide' : 'Show'}</button>
</div>

<div class="diagram-wrapper">
	{#if show}
		<Diagram {project} />
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
