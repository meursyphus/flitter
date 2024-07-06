<script lang="ts">
	import {
		Alignment,
		Container,
		EdgeInsets,
		TextStyle,
		Column,
		MainAxisSize,
		TextField,
		Colors
	} from '@meursyphus/flitter';
	import Widget from '../lib/Widget.svelte';
</script>

<Widget
	width="300px"
	height="150px"
	renderer="svg"
	widget={Container({
		height: Infinity,
		color: Colors.gray[500],
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
						//console.log("chnaged", value);
					},
					onSubmitted: (value) => {
						//console.log("submitted", value);
					}
				})
			]
		})
	})}
/>

<style>
</style>
