<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import { Column, Container, MainAxisSize, Row } from '@meursyphus/flitter';
	import TextField from './TextField';

	let el: HTMLTextAreaElement;
</script>

<Widget
	width="600px"
	height="150px"
	renderer="svg"
	widget={Container({
		width: 600,
		height: Infinity,
		color: 'lightgray',
		child: Row({
			mainAxisSize: MainAxisSize.min,
			children: [new TextField()]
		})
	})}
/>

<style>
</style>
