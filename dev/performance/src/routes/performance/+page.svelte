<script lang="ts">
	import type { PageData } from './$types';
	import { ToastStackedBarChart, ToastLineChart } from 'shared/chart';
	import SvelteWidget from '@flitterjs/svelte';

	export let data: PageData;

	const chartHistories = data.histories
		.slice(data.histories.length - 6, data.histories.length)
		.sort((a, b) => a.timestamp - b.timestamp);
	const recentHistories = [...chartHistories].sort((a, b) => b.timestamp - a.timestamp);

	const lineChartData = convertChartData(chartHistories);
	const stackedChart = convertChartData(chartHistories, [
		'paint',
		'paintTransform',
		'layout',
		'mount'
	]);

	function formatDayLabel(date: Date) {
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${date.getFullYear()}-${month}-${day}`;
	}

	function convertChartData(
		histories: PageData['histories'],
		keys: (keyof PageData['histories'][number])[] = [
			'runApp',
			'mount',
			'draw',
			'layout',
			'paintTransform',
			'paint'
		]
	) {
		const labels = histories.map((d) => formatDayLabel(new Date(d.timestamp)));
		const datasets: { values: number[]; legend: string }[] = keys.map((legend) => ({
			values: histories.map((d) => Math.floor(Number(d[legend] ?? 0))),
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
		renderer="canvas"
		widget={ToastLineChart({
			data: lineChartData,
			config: {
				colors: ['#785fff', '#00bd9f', '#ffb840', '#ff6b6b', '#4c6ef5', '#3bb7d6']
			}
		})}
	/>
	<SvelteWidget
		width="700px"
		height="600px"
		widget={ToastStackedBarChart({
			data: {
				...stackedChart
			},
			config: {
				colors: ['#785fff', '#3bb7d6', '#00bd9f', '#ffb840']
			}
		})}
	/>
</div>

<div class="history-list">
	{#each recentHistories as history}
		<div class="history-item">
			<strong>{formatDayLabel(new Date(history.timestamp))}</strong>
			<p>{history.note?.trim() || 'No label'}</p>
		</div>
	{/each}
</div>

<style>
	.chart-wrapper {
		display: flex;
		gap: 1rem;
	}

	.history-list {
		margin-top: 1.5rem;
		display: grid;
		gap: 0.75rem;
	}

	.history-item {
		padding: 0.75rem 1rem;
		border: 1px solid #d8dde6;
		border-radius: 0.75rem;
		background: #f8fafc;
	}

	.history-item p {
		margin: 0.25rem 0 0;
		color: #4b5563;
	}
</style>
