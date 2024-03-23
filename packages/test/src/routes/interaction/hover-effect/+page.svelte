<script lang="ts">
	import { Center, Text, Tooltip } from '@meursyphus/flitter';
	import SvelteWidget from '@meursyphus/flitter-svelte';
</script>

<SvelteWidget
	widget={Center({
		child: Tooltip({
			child: Text('hover me'),
			tooltip: Text('tooltip')
		})
	})}
/>
