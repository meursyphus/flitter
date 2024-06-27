<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import {
		Column,
		Container,
		EdgeInsets,
		MainAxisSize,
		Row,
		TextField,
		TextStyle
	} from '@meursyphus/flitter';

	let el: HTMLTextAreaElement;
</script>

<Widget
	width="300px"
	height="150px"
	renderer="svg"
	widget={Container({
		height: Infinity,
		color: 'lightgray',
		child: Row({
			mainAxisSize: MainAxisSize.min,
			children: [
				TextField('안녕하세요', {
					padding: EdgeInsets.symmetric({ horizontal: 1 }),
					style: new TextStyle({
						fontSize: 20
					})
				})
			]
		})
	})}
/>

<style>
</style>
