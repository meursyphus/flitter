<script lang="ts">
	import Widget from '@meursyphus/flitter-svelte';
	export let renderer: 'svg' | 'canvas' = 'svg';
	export let widget: any;
	export let width: string;
	export let height: string;
	export let description = '';
</script>

<div class="widget">
	<Widget {widget} {width} {height} {renderer} />
	<p class="size">
		{width.replace('px', '')} × {height.replace('px', '')}
	</p>
</div>

{#if description}
	<h3 class="">Description</h3>
	<p class="description">
		{description}
	</p>
{/if}

<style>
	.widget {
		width: fit-content;
		position: relative;
		background-color: #e0e0e0;
		color: white;
	}
	.size {
		position: absolute;
		margin: 0px;
		bottom: 4px;
		right: 4px;
	}
	h3 {
		margin-top: 20px;
		border-bottom: 1px solid grey;
	}
	.description {
		max-width: 700px;
		margin-top: 8px;
		line-height: 1.5em;
		white-space: pre-wrap;
	}
	:global(.highlight code) {
		padding: 20px !important;
	}
	:global(pre) {
		tab-size: 2;
	}
	:global(svg text) {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
