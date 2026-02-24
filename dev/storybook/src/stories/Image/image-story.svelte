<script lang="ts">
	import Native from './image-native.svelte';
	import Flitter from './image-flitter.svelte';
</script>

<div class="container">
	<Native />
	<Flitter />
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-content: stretch;
	}

	:global(body, html) {
		margin: 0;
		padding: 0;
		background-color: #f0f0f0;
	}
</style>
