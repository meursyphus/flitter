<script lang="ts">
	import { Center, Text, Container } from 'flitterjs';
	import Tooltip from 'flitterjs/component/Tooltip';
	import SvelteWidget from '@flitterjs/adapter-svelte';
</script>

<SvelteWidget
	widget={Center({
		child: Tooltip({
			child: Container({
				color: 'yellow',
				child: Text('hover me')
			}),
			tooltip: Text('tooltip')
		})
	})}
/>
