<script lang="ts">
	import type { PageData } from './$types';
	import { ToastStackedBarChart, LineChart } from 'shared/chart';
	import SvelteWidget from '@flitterjs/svelte';

	export let data: PageData;

	const histories = data.histories
		.slice(data.histories.length - 6, data.histories.length)
		.sort((a, b) => a.timestamp - b.timestamp);

	const lineChartData = convertChartData(histories);
	const stackedChart = convertChartData(histories, ['paint', 'layout', 'mount']);

	function convertChartData(
		histories: PageData['histories'],
		keys: (keyof PageData['histories'][number])[] = ['runApp', 'mount', 'draw', 'layout', 'paint']
	) {
		const labels = histories.map((d) => formatChartLabel(new Date(d.timestamp)));
		const datasets: { values: number[]; legend: string }[] = keys.map((legend) => ({
			values: histories.map((d) => Math.floor(d[legend] as number)),
			legend
		}));

		return { labels, datasets };
	}

	function formatChartLabel(date: Date) {
		const year = `${date.getFullYear()}`;
		const month = `${date.getMonth() + 1}`.padStart(2, '0');
		const day = `${date.getDate()}`.padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
</script>

<a href="/performance/diagram">Render diagram</a>
<h1>Performance on diagram rendered</h1>

<div class="chart-wrapper">
	<SvelteWidget
		width="800px"
		height="600px"
		renderer="canvas"
		widget={LineChart({
			data: lineChartData
		})}
	/>
	<SvelteWidget
		width="760px"
		height="600px"
		widget={ToastStackedBarChart({
			data: {
				...stackedChart
			},
			config: {
				legend: {
					visible: true,
					position: 'bottom',
					gap: 12
				},
				animation: {
					enabled: true,
					duration: 300,
					staggerDelay: 60
				},
				bar: {
					gap: 0
				}
			}
		})}
	/>
</div>

<style>
	.chart-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-start;
	}
</style>
