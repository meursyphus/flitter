import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	SizedBox,
} from "flitter-core";
import { ComboChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.legends.map((name, index) => new Legend({ name, index })),
				plot: new Plot(),
			},
			ctx,
		);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
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
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

abstract class Axis extends StatelessWidget {
	protected getLabels(scale: { min: number; max: number; step: number } | undefined): string[] {
		if (scale == null) return [];
		const labels = [];
		for (let index = 0; index <= (scale.max - scale.min) / scale.step; index++) {
			labels.push(scale.min + scale.step * index);
		}
		return labels.map((label) => label.toString());
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.plot(
			{
				xAxis: new XAxis(),
				yAxis: new YAxis(),
				yAxis2: new YAxis2(),
				dataView: new DataView(),
				grid: new Grid(),
				axisCorner: new AxisCorner(),
			},
			ctx,
		);
	}
}

class XAxis extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.xAxis(
			{
				line: new XAxisLine(),
				labels: ctx.data.labels.map(
					(label, index) => new XAxisLabel({ name: label, index }),
				),
				tick: new XAxisTick(),
			},
			ctx,
		);
	}
}

class YAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.yAxis(
			{
				line: new YAxisLine(),
				labels: this.getLabels(ctx.scale?.primary).map(
					(label, index) => new YAxisLabel({ name: label, index }),
				),
				tick: new YAxisTick(),
			},
			ctx,
		);
	}
}

class YAxis2 extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.yAxis2(
			{
				labels: this.getLabels(ctx.scale?.secondary).map(
					(label, index) => new YAxis2Label({ name: label, index }),
				),
				tick: new YAxisTick(),
			},
			ctx,
		);
	}
}

class XAxisLabel extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.xAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class YAxisLabel extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class YAxis2Label extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.yAxis2Label({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.yAxisTick(undefined, ctx);
	}
}

class XAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class YAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.yAxisLine(undefined, ctx);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		const bars = ctx.bars.flatMap((dataset, datasetIndex) =>
			dataset.values.map(
				(value, index) =>
					new Bar({
						value,
						index,
						label: ctx.data.labels[index],
						legend: dataset.legend,
						datasetIndex,
						yAxisId: dataset.yAxisId ?? "primary",
					}),
			),
		);

		const lines = ctx.lines.map((dataset, datasetIndex) =>
			new LineSeries({
				values: dataset.values,
				legend: dataset.legend,
				datasetIndex,
				yAxisId: dataset.yAxisId ?? "primary",
			}),
		);

		const areas = ctx.areas.map((dataset, datasetIndex) =>
			new AreaSeries({
				values: dataset.values,
				legend: dataset.legend,
				datasetIndex,
				yAxisId: dataset.yAxisId ?? "primary",
			}),
		);

		return ctx.custom.dataView({ bars, lines, areas }, ctx);
	}
}

class Bar extends StatelessWidget {
	#props: {
		value: number;
		index: number;
		label: string;
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	};

	constructor(props: {
		value: number;
		index: number;
		label: string;
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	}) {
		super();
		this.#props = props;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.bar(this.#props, ctx);
	}
}

class LinePoint extends StatelessWidget {
	#props: {
		value: number;
		index: number;
		label: string;
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	};

	constructor(props: {
		value: number;
		index: number;
		label: string;
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	}) {
		super();
		this.#props = props;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.linePoint(this.#props, ctx);
	}
}

class LineSeries extends StatelessWidget {
	#props: {
		values: number[];
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	};

	constructor(props: {
		values: number[];
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	}) {
		super();
		this.#props = props;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.line(
			{
				...this.#props,
				points: this.#props.values.map(
					(value, index) =>
						new LinePoint({
							value,
							index,
							label: ctx.data.labels[index],
							legend: this.#props.legend,
							datasetIndex: this.#props.datasetIndex,
							yAxisId: this.#props.yAxisId,
						}),
				),
			},
			ctx,
		);
	}
}

class AreaSeries extends StatelessWidget {
	#props: {
		values: number[];
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	};

	constructor(props: {
		values: number[];
		legend: string;
		datasetIndex: number;
		yAxisId: "primary" | "secondary";
	}) {
		super();
		this.#props = props;
	}

	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.area(
			{
				...this.#props,
				points: this.#props.values.map(
					(value, index) =>
						new LinePoint({
							value,
							index,
							label: ctx.data.labels[index],
							legend: this.#props.legend,
							datasetIndex: this.#props.datasetIndex,
							yAxisId: this.#props.yAxisId,
						}),
				),
			},
			ctx,
		);
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.grid(
			{ xLine: new GridXLine(), yLine: new GridYLine() },
			ctx,
		);
	}
}

class GridXLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.gridXLine(undefined, ctx);
	}
}

class GridYLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.gridYLine(undefined, ctx);
	}
}

class AxisCorner extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ComboChartProvider.of(context);
		return ctx.custom.axisCorner(undefined, ctx);
	}
}
