import { type Widget, StatelessWidget } from 'flitter-core';
import type { BoxPlotChartCustom, BoxPlotChartData, BoxPlotChartScale } from './types';
import { BoxPlotChartConfigProvider } from './provider';
import * as Default from './default';
import Chart from './chart';
import { classToFn } from '@utils/index';

class BoxPlotChart extends StatelessWidget {
	#config: BoxPlotChartCustom;
	#data: BoxPlotChartData;
	#getScale: (data: BoxPlotChartData) => BoxPlotChartScale;
	#title: string;

	constructor({
		custom: {
			boxPlotGroup = Default.BoxPlotGroup,
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
			boxPlot = Default.BoxPlot,
			outlier = Default.Outlier,
			xAxisLine = Default.XAxisLine,
			yAxisLine = Default.YAxisLine,
			grid = Default.Grid,
			gridXLine = Default.GridXLine,
			gridYLine = Default.GridYLine,
			axisCorner = Default.AxisCorner
		} = {},
		getScale = Default.getScale,
		data,
		title = ''
	}: {
		custom?: Partial<BoxPlotChartCustom>;
		title?: string;
		data: BoxPlotChartData;
		getScale?: (data: BoxPlotChartData) => BoxPlotChartScale;
	}) {
		super();
		this.#data = data;
		this.#getScale = getScale;
		this.#title = title;
		this.#config = {
			boxPlotGroup,
			boxPlot,
			outlier,
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
			grid,
			gridXLine,
			gridYLine,
			axisCorner
		};
	}

	override build(): Widget {
		const scale = this.#getScale(this.#data);

		return BoxPlotChartConfigProvider({
			value: {
				custom: this.#config,
				data: this.#data,
				scale,
				title: this.#title
			},
			child: new Chart()
		});
	}
}

export default classToFn(BoxPlotChart);
