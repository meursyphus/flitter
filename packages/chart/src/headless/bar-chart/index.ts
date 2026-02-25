import { type Widget, StatelessWidget } from 'flitter-core';
import type { BarChartCustom, BarChartData, BarChartScale } from './types';
import { BarChartConfigProvider } from './provider';
import * as Default from './default';
import Chart from './chart';

class _BarChart<TConfig = {}> extends StatelessWidget {
	#custom: BarChartCustom<TConfig>;
	#data: BarChartData;
	#getScale: (data: BarChartData) => BarChartScale;
	#title: string;
	#direction: 'vertical' | 'horizontal';
	#userConfig: TConfig;

	constructor({
		custom = {},
		getScale = Default.getScale,
		data,
		title = '',
		direction = 'vertical',
		config = {} as TConfig
	}: {
		custom?: Partial<BarChartCustom<TConfig>>;
		title?: string;
		data: BarChartData;
		direction?: 'vertical' | 'horizontal';
		getScale?: (data: BarChartData) => BarChartScale;
		config?: TConfig;
	}) {
		super();
		this.#data = data;
		this.#getScale = getScale;
		this.#title = title;
		this.#direction = direction;
		this.#userConfig = config;
		const defaults = {
			barGroup: Default.BarGroup,
			bar: Default.Bar,
			xAxis: Default.XAxis,
			xAxisLabel: Default.XAxisLabel,
			xAxisTick: Default.XAxisTick,
			xAxisLine: Default.XAxisLine,
			yAxis: Default.YAxis,
			yAxisLabel: Default.YAxisLabel,
			yAxisTick: Default.YAxisTick,
			yAxisLine: Default.YAxisLine,
			series: Default.Series,
			layout: Default.Layout,
			plot: Default.Plot,
			legend: Default.Legend,
			title: Default.Title,
			dataLabel: Default.DataLabel,
			grid: Default.Grid,
			gridXLine: Default.GridXLine,
			gridYLine: Default.GridYLine,
			axisCorner: Default.AxisCorner
		};
		this.#custom = { ...defaults, ...custom } as BarChartCustom<TConfig>;
	}

	override build(): Widget {
		const scale = this.#getScale(this.#data);

		return BarChartConfigProvider({
			value: {
				custom: this.#custom,
				data: this.#data,
				scale,
				title: this.#title,
				direction: this.#direction,
				config: this.#userConfig
			},
			child: new Chart()
		});
	}
}

export default function BarChart<TConfig = {}>(props: {
	custom?: Partial<BarChartCustom<TConfig>>;
	title?: string;
	data: BarChartData;
	direction?: 'vertical' | 'horizontal';
	getScale?: (data: BarChartData) => BarChartScale;
	config?: TConfig;
}): Widget {
	return new _BarChart(props);
}
