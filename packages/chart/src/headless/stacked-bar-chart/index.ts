import { type Widget, StatelessWidget } from 'flitter-core';
import type { StackedBarChartCustom, StackedBarChartData, StackedBarChartScale } from './types';
import { StackedBarChartConfigProvider } from './provider';
import * as Default from './default';
import Chart from './chart';
import { classToFn } from '@utils/index';

class StackedBarChart extends StatelessWidget {
	#config: StackedBarChartCustom;
	#data: StackedBarChartData;
	#getScale: (data: StackedBarChartData) => StackedBarChartScale;
	#title: string;
	#direction: 'vertical' | 'horizontal';

	constructor({
		custom: {
			barGroup = Default.BarGroup,
			xAxis = Default.XAxis,
			xAxisLabel = Default.XAxisLabel,
			xAxisTick = Default.XAxisTick,
			yAxis = Default.YAxis,
			yAxisLabel = Default.YAxisLabel,
			yAxisTick = Default.YAxisTick,
			series = Default.Series,
			layout = Default.Layout,
			plot = Default.Plot,
			legend = Default.Legend,
			title: titleWidget = Default.Title,
			dataLabel = Default.DataLabel,
			bar = Default.Bar,
			xAxisLine = Default.XAxisLine,
			yAxisLine = Default.YAxisLine,
			grid = Default.Grid,
			gridXLine = Default.GridXLine,
			gridYLine = Default.GridYLine,
			axisCorner = Default.AxisCorner
		} = {},
		getScale = Default.getScale,
		data,
		title = '',
		direction = 'vertical'
	}: {
		custom?: Partial<StackedBarChartCustom>;
		title?: string;
		data: StackedBarChartData;
		direction?: 'vertical' | 'horizontal';
		getScale?: (data: StackedBarChartData) => StackedBarChartScale;
	}) {
		super();
		this.#data = data;
		this.#getScale = getScale;
		this.#title = title;
		this.#direction = direction;
		this.#config = {
			barGroup,
			bar,
			xAxis,
			xAxisLabel,
			xAxisTick,
			xAxisLine,
			yAxis,
			yAxisLabel,
			yAxisTick,
			yAxisLine,
			series,
			layout,
			plot,
			legend,
			title: titleWidget,
			dataLabel,
			grid,
			gridXLine,
			gridYLine,
			axisCorner
		};
	}

	override build(): Widget {
		const scale = this.#getScale(this.#data);

		return StackedBarChartConfigProvider({
			value: {
				custom: this.#config,
				data: this.#data,
				scale,
				title: this.#title,
				direction: this.#direction
			},
			child: new Chart()
		});
	}
}

export default classToFn(StackedBarChart);
