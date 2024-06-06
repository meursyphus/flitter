<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import { Alignment, Center, Container, Text, TextField } from '@meursyphus/flitter';

	let el: HTMLTextAreaElement;
</script>

<Widget
	width="300px"
	height="300px"
	widget={Container({
		width: 300,
		height: 300,
		color: 'red',
		child: TextField()
	})}
/>

<textarea bind:this={el} />
<button on:click={() => el.focus()} />

<style>
</style>
