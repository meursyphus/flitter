import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	SizedBox,
	GestureDetector,
} from "flitter-core";
import { CandlestickChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default Chart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				plot: new Plot(),
				legends: ctx.legends.map((name, index) => new Legend({ name, index })),
			},
			ctx,
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
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

abstract class Axis extends StatelessWidget {
	protected getValueLabels(context: BuildContext): string[] {
		const { scale } = CandlestickChartProvider.of(context);
		if (scale == null) return [];
		const labels = [];
		for (
			let index = 0;
			index <= (scale.max - scale.min) / scale.step;
			index++
		) {
			labels.push(scale.min + scale.step * index);
		}
		return labels.map((label) => label.toString());
	}

	protected getCategoryLabels(context: BuildContext): string[] {
		const { data } = CandlestickChartProvider.of(context);
		return data.labels;
	}
}

class XAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.xAxis(
			{
				labels: this.getCategoryLabels(context).map(
					(label, index) => new XAxisLabel({ index, name: label }),
				),
				tick: new XAxisTick(),
				line: new XAxisLine(),
			},
			ctx,
		);
	}
}

class XAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class YAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.yAxis(
			{
				labels: this.getValueLabels(context).map(
					(label, index) => new YAxisLabel({ index, name: label }),
				),
				tick: new YAxisTick(),
				line: new YAxisLine(),
			},
			ctx,
		);
	}
}

class YAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.yAxisLine(undefined, ctx);
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
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.xAxisLabel({ name: this.#name, index: this.#index }, ctx);
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
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.yAxisTick(undefined, ctx);
	}
}

class Candlestick extends StatelessWidget {
	#index: number;
	#datasetIndex: number;

	constructor({
		index,
		datasetIndex,
	}: {
		index: number;
		datasetIndex: number;
	}) {
		super();
		this.#index = index;
		this.#datasetIndex = datasetIndex;
	}

	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		const dataset = ctx.data.datasets[this.#datasetIndex];
		const point = dataset.data[this.#index];
		const index = this.#index;
		const legend = dataset.legend;
		const isHovered = ctx.isCandlestickHovered(index, legend);
		return GestureDetector({
			cursor: "default",
			onMouseEnter: () => ctx.hoverCandlestick(index, legend),
			onMouseLeave: () => ctx.unhoverCandlestick(index, legend),
			child: ctx.custom.candlestick(
				{
					open: point.open,
					high: point.high,
					low: point.low,
					close: point.close,
					label: ctx.data.labels[this.#index],
					index,
					legend,
					datasetIndex: this.#datasetIndex,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class AxisCorner extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.axisCorner(undefined, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.plot(
			{
				xAxis: new XAxis(),
				yAxis: new YAxis(),
				dataView: new DataView(),
				grid: new Grid(),
				axisCorner: new AxisCorner(),
			},
			ctx,
		);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllCandlesticks(),
			child: ctx.custom.dataView(
				{
					candlestickGroups: Array.from({ length: ctx.data.labels.length }, (_, index) => ({
						label: ctx.data.labels[index],
						index,
						candlesticks: ctx.data.datasets.map(
							(_, datasetIndex) => new Candlestick({ index, datasetIndex }),
						),
					})),
				},
				ctx,
			),
		});
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.grid(
			{ xLine: new GridXLine(), yLine: new GridYLine() },
			ctx,
		);
	}
}

class GridXLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.gridXLine(undefined, ctx);
	}
}

class GridYLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = CandlestickChartProvider.of(context);
		return ctx.custom.gridYLine(undefined, ctx);
	}
}
