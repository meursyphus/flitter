<script lang="ts">
	import type { PageData } from './$types';
	import { StackedBarChart, LineChart } from '@meursyphus/flitter-chart';
	import SvelteWidget from '@meursyphus/flitter-svelte';
	import { formatDate } from '$lib/formatDate';

	export let data: PageData;

	const histories = data.histories.slice(0, 6).sort((a, b) => a.timestamp - b.timestamp);

	const lineChartData = convertChartData(histories);
	const stackedChart = convertChartData(histories, ['paint', 'layout', 'mount']);

	function convertChartData(
		histories: PageData['histories'],
		keys: (keyof PageData['histories'][number])[] = ['runApp', 'mount', 'draw', 'layout', 'paint']
	) {
		const labels = histories.map((d) => formatDate(new Date(d.timestamp)));
		const datasets: { data: number[]; legend: string }[] = keys.map((legend) => ({
			data: histories.map((d) => Math.floor(d[legend] as number)),
			legend
		}));

		return { labels, datasets };
	}
</script>

<a href="/performance/diagram">Render diagram</a>
<h1>Performance on diagram rendered</h1>

<div class="chart-wrapper">
	<SvelteWidget
		width="800px"
		height="600px"
		widget={LineChart({
			data: lineChartData
		})}
	/>
	<SvelteWidget
		width="700px"
		height="600px"
		widget={StackedBarChart({
			data: {
				...stackedChart
			},
			theme: {
				series: {
					colors: ['#785fff', '#00bd9f', '#ffb840']
				}
			},

			custom: {
				series: {
					type: 'config'
				},
				dataLabel: {
					type: 'config',
					visible: true,
					font: {
						fontSize: 14
					}
				},
				bar: {
					type: 'config',
					thickness: 60
				}
			}
		})}
	/>
</div>

<style>
	.chart-wrapper {
		display: flex;
		gap: 1rem;
	}
</style>
