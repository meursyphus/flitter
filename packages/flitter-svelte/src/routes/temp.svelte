<script lang="ts">
	import Widget from '../lib/Widget.svelte';
	import { Container, Colors, ColoredBox, Alignment, Image } from '@meursyphus/flitter';
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
				width: 750,
				height: 250,
				objectFit: 'none'
			})
		})
	})}
/>
