<script lang="ts">
	import { Center, Text, Tooltip, Container } from '@meursyphus/flitter';
	import SvelteWidget from '@meursyphus/flitter-svelte';
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
