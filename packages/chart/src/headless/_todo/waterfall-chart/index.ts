import { type Widget, StatelessWidget } from 'flitter-core';
import type { WaterfallChartCustom, WaterfallChartData, WaterfallChartScale } from './types';
import { WaterfallChartConfigProvider } from './provider';
import * as Default from './default';
import Chart from './chart';
import { classToFn } from '@utils/index';

class WaterfallChart extends StatelessWidget {
	#config: WaterfallChartCustom;
	#data: WaterfallChartData;
	#getScale: (data: WaterfallChartData) => { scale: WaterfallChartScale; cumulativeValues: number[] };
	#title: string;

	constructor({
		custom: {
			bar = Default.Bar,
			connector = Default.Connector,
			xAxis = Default.XAxis,
			xAxisLabel = Default.XAxisLabel,
			xAxisTick = Default.XAxisTick,
			yAxis = Default.YAxis,
			yAxisLabel = Default.YAxisLabel,
			yAxisTick = Default.YAxisTick,
			dataView = Default.DataView,
			layout = Default.Layout,
			plot = Default.Plot,
			legend = Default.Legend,
			title: titleWidget = Default.Title,
			dataLabel = Default.DataLabel,
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
		custom?: Partial<WaterfallChartCustom>;
		title?: string;
		data: WaterfallChartData;
		getScale?: (data: WaterfallChartData) => { scale: WaterfallChartScale; cumulativeValues: number[] };
	}) {
		super();
		this.#data = data;
		this.#getScale = getScale;
		this.#title = title;
		this.#config = {
			bar,
			connector,
			xAxis,
			xAxisLabel,
			xAxisTick,
			xAxisLine,
			yAxis,
			yAxisLabel,
			yAxisTick,
			yAxisLine,
			dataView,
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
		const { scale, cumulativeValues } = this.#getScale(this.#data);

		return WaterfallChartConfigProvider({
			value: {
				custom: this.#config,
				data: this.#data,
				scale,
				title: this.#title,
				cumulativeValues
			},
			child: new Chart()
		});
	}
}

export default classToFn(WaterfallChart);
