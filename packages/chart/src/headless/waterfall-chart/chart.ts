import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	SizedBox,
	GestureDetector,
} from "flitter-core";
import { WaterfallChartProvider } from "./provider";
import type { WaterfallBarType } from "./types";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default Chart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
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
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				plot: new Plot(),
				legends: [
					new Legend({ name: "Increase", index: 0 }),
					new Legend({ name: "Decrease", index: 1 }),
					new Legend({ name: "Total", index: 2 }),
				],
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
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index, isVisible: true }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

abstract class Axis extends StatelessWidget {
	protected getValueLabels(context: BuildContext): string[] {
		const { scale } = WaterfallChartProvider.of(context);
		if (scale == null) return [];
		const labels = [];
		for (let index = 0; index <= (scale.max - scale.min) / scale.step; index++) {
			labels.push(scale.min + scale.step * index);
		}
		return labels.map((label) => label.toString());
	}

	protected getCategoryLabels(context: BuildContext): string[] {
		const { data } = WaterfallChartProvider.of(context);
		return data.labels;
	}
}

class XAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
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
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class YAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
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
		const ctx = WaterfallChartProvider.of(context);
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
		const ctx = WaterfallChartProvider.of(context);
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
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.yAxisTick(undefined, ctx);
	}
}

class Bar extends StatelessWidget {
	#value: number;
	#cumulative: number;
	#index: number;
	#label: string;
	#type: WaterfallBarType;

	constructor({
		value,
		cumulative,
		index,
		label,
		type,
	}: {
		value: number;
		cumulative: number;
		index: number;
		label: string;
		type: WaterfallBarType;
	}) {
		super();
		this.#value = value;
		this.#cumulative = cumulative;
		this.#index = index;
		this.#label = label;
		this.#type = type;
	}

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		const index = this.#index;
		const isHovered = ctx.isBarHovered(index);
		return GestureDetector({
			cursor: "default",
			onMouseEnter: () => ctx.hoverBar(index),
			onMouseLeave: () => ctx.unhoverBar(),
			child: ctx.custom.bar(
				{
					value: this.#value,
					cumulative: this.#cumulative,
					index,
					label: this.#label,
					type: this.#type,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class Connector extends StatelessWidget {
	#fromCumulative: number;
	#toCumulative: number;
	#index: number;

	constructor({
		fromCumulative,
		toCumulative,
		index,
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
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.connector(
			{
				fromCumulative: this.#fromCumulative,
				toCumulative: this.#toCumulative,
				index: this.#index,
			},
			ctx,
		);
	}
}

class AxisCorner extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.axisCorner(undefined, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
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
		const ctx = WaterfallChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		const bars = ctx.data.values.map((value, index) => {
			return new Bar({
				value,
				cumulative: ctx.cumulativeValues[index],
				index,
				label: ctx.data.labels[index],
				type: ctx.types[index],
			});
		});

		const connectors: Widget[] = [];
		for (let index = 0; index < ctx.data.values.length - 1; index++) {
			connectors.push(
				new Connector({
					fromCumulative: ctx.cumulativeValues[index],
					toCumulative: ctx.cumulativeValues[index + 1],
					index,
				}),
			);
		}

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllBars(),
			child: ctx.custom.dataView({ bars, connectors }, ctx),
		});
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.grid(
			{ xLine: new GridXLine(), yLine: new GridYLine() },
			ctx,
		);
	}
}

class GridXLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.gridXLine(undefined, ctx);
	}
}

class GridYLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		return ctx.custom.gridYLine(undefined, ctx);
	}
}
