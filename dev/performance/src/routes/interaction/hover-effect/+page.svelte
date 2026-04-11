<script lang="ts">
	import { Center, Text, Tooltip, Container } from 'flitter-core';
	import SvelteWidget from '@flitterjs/svelte';
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
