<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import {
	Alignment,
	Column,
		Container,
		EdgeInsets,
		MainAxisSize,
		TextField,
		TextStyle
	} from '@meursyphus/flitter';
</script>

<Widget
	width="300px"
	height="150px"
	renderer="svg"
	widget={Container({
		height: Infinity,
		color: 'lightgray',
		alignment: Alignment.center,
		child: Column({
			mainAxisSize: MainAxisSize.min,
			children: [
				TextField('', {
					padding: EdgeInsets.symmetric({ horizontal: 4, vertical: 4 }),
					style: new TextStyle({
						fontSize: 20
					}),
					onChanged: (value) => {
						console.log("chnaged", value);
					},
					onSubmitted: (value) => {
						console.log("submitted", value);
					}
				}),
			]
		})
	})}
/>

<style>
</style>
