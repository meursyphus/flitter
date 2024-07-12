<script lang="ts">
	import { Image, Container, Colors, ColoredBox, Alignment } from '@meursyphus/flitter';
	import Widget from '../lib/Widget.svelte';
	import profile from './profile.png';
</script>

<Widget
	width="100vw"
	height="100vh"
	renderer="canvas"
	widget={Container({
		alignment: Alignment.center,
		color: Colors.gray[200],
		child: ColoredBox({
			color: Colors.white,
			child: Image({
				src: profile,
				width: 250,
				height: 500,
				objectFit: 'contain'
			})
		})
	})}
/>

<style>
	:global(html, body) {
		padding: 0;
		margin: 0;
	}
</style>
