import {
	StatelessWidget,
	type Widget,
	type BuildContext
} from 'flitter-core';
import { WaterfallChartConfigProvider } from './provider';

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new Layout();
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.layout(
			{
				title: new Title(),
				plot: new Plot(),
				legends: [
					new Legend({ name: 'Increase', index: 0 }),
					new Legend({ name: 'Decrease', index: 1 }),
					new Legend({ name: 'Total', index: 2 })
				]
			},
			config
		);
	}
}

class Legend extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.legend({ name: this.#name, index: this.#index }, config);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom, title } = config;
		return custom.title({ name: title }, config);
	}
}

abstract class Axis extends StatelessWidget {
	protected getValueLabels(context: BuildContext): string[] {
		const {
			scale: { min, max, step }
		} = WaterfallChartConfigProvider.of(context);
		const labels = [];
		for (let i = 0; i <= (max - min) / step; i++) {
			labels.push(min + step * i);
		}
		return labels.map((label) => label.toString());
	}
	protected getCategoryLabels(context: BuildContext): string[] {
		const { data } = WaterfallChartConfigProvider.of(context);
		return data.labels;
	}
}

class XAxis extends Axis {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		const labels = this.getCategoryLabels(context);
		return custom.xAxis(
			{
				labels: labels.map((label, index) => new XAxisLabel({ index, name: label })),
				tick: new XAxisTick(),
				line: new XAxisLine()
			},
			config
		);
	}
}

class XAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.xAxisLine(undefined, config);
	}
}

class YAxis extends Axis {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.yAxis(
			{
				labels: this.getValueLabels(context).map(
					(label, index) => new YAxisLabel({ index, name: label })
				),
				tick: new YAxisTick(),
				line: new YAxisLine()
			},
			config
		);
	}
}

class YAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.yAxisLine(undefined, config);
	}
}

class XAxisLabel extends StatelessWidget {
	#index: number;
	#name: string;

	constructor({ index, name }: { index: number; name: string }) {
		super();
		this.#index = index;
		this.#name = name;
	}

	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.xAxisLabel({ name: this.#name, index: this.#index }, config);
	}
}

class YAxisLabel extends StatelessWidget {
	#index: number;
	#name: string;

	constructor({ index, name }: { index: number; name: string }) {
		super();
		this.#index = index;
		this.#name = name;
	}

	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.yAxisLabel({ name: this.#name, index: this.#index }, config);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.xAxisTick(undefined, config);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.yAxisTick(undefined, config);
	}
}

class Bar extends StatelessWidget {
	#value: number;
	#cumulative: number;
	#index: number;
	#label: string;
	#type: 'increase' | 'decrease' | 'total';

	constructor({
		value,
		cumulative,
		index,
		label,
		type
	}: {
		value: number;
		cumulative: number;
		index: number;
		label: string;
		type: 'increase' | 'decrease' | 'total';
	}) {
		super();
		this.#value = value;
		this.#cumulative = cumulative;
		this.#index = index;
		this.#label = label;
		this.#type = type;
	}

	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.bar(
			{
				value: this.#value,
				cumulative: this.#cumulative,
				index: this.#index,
				label: this.#label,
				type: this.#type
			},
			config
		);
	}
}

class Connector extends StatelessWidget {
	#fromCumulative: number;
	#toCumulative: number;
	#index: number;

	constructor({
		fromCumulative,
		toCumulative,
		index
	}: {
		fromCumulative: number;
		toCumulative: number;
		index: number;
	}) {
		super();
		this.#fromCumulative = fromCumulative;
		this.#toCumulative = toCumulative;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.connector(
			{
				fromCumulative: this.#fromCumulative,
				toCumulative: this.#toCumulative,
				index: this.#index
			},
			config
		);
	}
}

class AxisCorner extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.axisCorner(undefined, config);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.plot(
			{ xAxis: new XAxis(), yAxis: new YAxis(), dataView: new DataView(), grid: new Grid(), axisCorner: new AxisCorner() },
			config
		);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom, data, cumulativeValues } = config;
		const totalIndices = new Set(data.totalIndices ?? []);

		const bars = data.values.map((value, index) => {
			const type: 'increase' | 'decrease' | 'total' = totalIndices.has(index)
				? 'total'
				: value >= 0
					? 'increase'
					: 'decrease';
			return new Bar({
				value,
				cumulative: cumulativeValues[index],
				index,
				label: data.labels[index],
				type
			});
		});

		const connectors: Widget[] = [];
		for (let i = 0; i < data.values.length - 1; i++) {
			connectors.push(
				new Connector({
					fromCumulative: cumulativeValues[i],
					toCumulative: cumulativeValues[i + 1],
					index: i
				})
			);
		}

		return custom.dataView({ bars, connectors }, config);
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.grid({ xLine: new GridXLine(), yLine: new GridYLine() }, config);
	}
}

class GridXLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.gridXLine(undefined, config);
	}
}

class GridYLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const config = WaterfallChartConfigProvider.of(context);
		const { custom } = config;
		return custom.gridYLine(undefined, config);
	}
}
