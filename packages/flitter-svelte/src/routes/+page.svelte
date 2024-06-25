<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import { Container } from '@meursyphus/flitter';
	import TextField from './TextField';

	let el: HTMLTextAreaElement;
</script>

<Widget
	width="300px"
	height="150px"
	renderer="canvas"
	widget={Container({
		width: 300,
		height: Infinity,
		color: 'lightgray',
		child: new TextField()
	})}
/>

<style>
</style>
