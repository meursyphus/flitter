import { type Widget, StatelessWidget } from 'flitter-core';
import type { CandlestickChartCustom, CandlestickChartData, CandlestickChartScale } from './types';
import { CandlestickChartConfigProvider } from './provider';
import * as Default from './default';
import Chart from './chart';
import { classToFn } from '@utils/index';

class CandlestickChart extends StatelessWidget {
	#config: CandlestickChartCustom;
	#data: CandlestickChartData;
	#getScale: (data: CandlestickChartData) => CandlestickChartScale;
	#title: string;

	constructor({
		custom: {
			candlestick = Default.Candlestick,
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
		custom?: Partial<CandlestickChartCustom>;
		title?: string;
		data: CandlestickChartData;
		getScale?: (data: CandlestickChartData) => CandlestickChartScale;
	}) {
		super();
		this.#data = data;
		this.#getScale = getScale;
		this.#title = title;
		this.#config = {
			candlestick,
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
		const scale = this.#getScale(this.#data);

		return CandlestickChartConfigProvider({
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

export default classToFn(CandlestickChart);
