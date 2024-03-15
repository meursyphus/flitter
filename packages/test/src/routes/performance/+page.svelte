<script lang="ts">
	import { Text, type Widget, Center } from '@meursyphus/flitter';
	import SvelteWidget from '@meursyphus/flitter-svelte';
	import Diagram from '$lib/diagram/Diagram.svelte';
	let show = true;
</script>

<div>
	<button on:click={() => (show = !show)}>{show ? 'Hide' : 'Show'}</button>
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
