import { type Widget, StatelessWidget } from 'flitter-core';
import type { PieChartCustom, PieChartData } from './types';
import { PieChartConfigProvider } from './provider';
import * as Default from './default';
import Chart from './chart';
import { classToFn } from '@utils/index';

const DEFAULT_COLORS = [
	'#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
	'#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
];

class PieChart extends StatelessWidget {
	#config: PieChartCustom;
	#data: PieChartData;
	#title: string;
	#innerRadius: number;
	#colors: string[];

	constructor({
		custom: {
			layout = Default.Layout,
			pie = Default.Pie,
			slice = Default.Slice,
			legend = Default.Legend,
			title: titleWidget = Default.Title,
			dataLabel = Default.DataLabel,
		} = {},
		data,
		title = '',
		innerRadius = 0,
		colors = DEFAULT_COLORS,
	}: {
		custom?: Partial<PieChartCustom>;
		title?: string;
		data: PieChartData;
		innerRadius?: number;
		colors?: string[];
	}) {
		super();
		this.#data = data;
		this.#title = title;
		this.#innerRadius = innerRadius;
		this.#colors = colors;
		this.#config = {
			layout,
			pie,
			slice,
			legend,
			title: titleWidget,
			dataLabel,
		};
	}

	override build(): Widget {
		return PieChartConfigProvider({
			value: {
				custom: this.#config,
				data: this.#data,
				title: this.#title,
				innerRadius: this.#innerRadius,
				colors: this.#colors,
			},
			child: new Chart(),
		});
	}
}

export default classToFn(PieChart);
