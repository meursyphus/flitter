<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import App from './app';
</script>

<Widget renderer="canvas" width="100%" height="100vh" widget={App()} />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		height: 100vh;
	}
</style>
