<script lang="ts">
	import { Center, Text, Container } from 'flitter-core';
	import Tooltip from 'flitter-core/component/Tooltip';
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
