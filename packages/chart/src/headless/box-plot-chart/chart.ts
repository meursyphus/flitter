import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	SizedBox,
	GestureDetector,
} from "flitter-core";
import { BoxPlotChartProvider } from "./provider";
import type { BoxPlotDataPoint } from "./types";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default Chart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
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
		const ctx = BoxPlotChartProvider.of(context);
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
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

abstract class Axis extends StatelessWidget {
	protected getValueLabels(context: BuildContext): string[] {
		const { scale } = BoxPlotChartProvider.of(context);
		if (scale == null) return [];
		const { min, max, step } = scale;
		const labels = [];
		for (let index = 0; index <= (max - min) / step; index++) {
			labels.push(min + step * index);
		}
		return labels.map((label) => label.toString());
	}

	protected getCategoryLabels(context: BuildContext): string[] {
		const { data } = BoxPlotChartProvider.of(context);
		return data.labels;
	}
}

class XAxis extends Axis {
	#getLabels(context: BuildContext): string[] {
		const { direction } = BoxPlotChartProvider.of(context);
		return direction === "vertical"
			? this.getCategoryLabels(context)
			: this.getValueLabels(context);
	}

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.xAxis(
			{
				labels: this.#getLabels(context).map(
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
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class YAxis extends Axis {
	#getLabels(context: BuildContext): string[] {
		const { direction } = BoxPlotChartProvider.of(context);
		return direction === "vertical"
			? this.getValueLabels(context)
			: this.getCategoryLabels(context);
	}

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.yAxis(
			{
				labels: this.#getLabels(context).map(
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
		const ctx = BoxPlotChartProvider.of(context);
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
		const ctx = BoxPlotChartProvider.of(context);
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
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.yAxisTick(undefined, ctx);
	}
}

class BoxPlotGroup extends StatelessWidget {
  #dataPoints: BoxPlotDataPoint[];
  #index: number;

  constructor({ dataPoints, index }: { dataPoints: BoxPlotDataPoint[]; index: number }) {
    super();
    this.#dataPoints = dataPoints;
    this.#index = index;
  }

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);

		return ctx.custom.boxPlotGroup(
			{
				index: this.#index,
				label: ctx.data.labels[this.#index],
				dataPoints: this.#dataPoints,
				boxPlots: this.#dataPoints.map(
					(dataPoint, datasetIndex) => ({
						boxPlot: new BoxPlot({
							dataPoint,
							index: this.#index,
							legend: ctx.data.datasets[datasetIndex].legend,
							label: ctx.data.labels[this.#index],
							datasetIndex,
						}),
						outliers: (dataPoint.outliers ?? []).map(
							(value, outlierIndex) =>
								new Outlier({
									value,
									outlierIndex,
									index: this.#index,
									legend: ctx.data.datasets[datasetIndex].legend,
									label: ctx.data.labels[this.#index],
									datasetIndex,
								}),
						),
					}),
				),
			},
			ctx,
		);
	}
}

class BoxPlot extends StatelessWidget {
  #dataPoint: BoxPlotDataPoint;
  #index: number;
	#legend: string;
	#label: string;
	#datasetIndex: number;

  constructor({
    dataPoint,
    index,
    legend,
    label,
    datasetIndex,
  }: {
    dataPoint: BoxPlotDataPoint;
    index: number;
    legend: string;
    label: string;
    datasetIndex: number;
  }) {
    super();
    this.#dataPoint = dataPoint;
    this.#index = index;
    this.#legend = legend;
    this.#label = label;
    this.#datasetIndex = datasetIndex;
  }

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		const index = this.#index;
		const legend = this.#legend;
		const isHovered = ctx.isBoxPlotHovered(index, legend);
		return GestureDetector({
			cursor: "default",
			onMouseEnter: () => ctx.hoverBoxPlot(index, legend, { kind: "boxPlot" }),
			onMouseLeave: () => ctx.unhoverBoxPlot({ index, legend, kind: "boxPlot" }),
			child: ctx.custom.boxPlot(
				{
					dataPoint: this.#dataPoint,
					index,
					legend,
					label: this.#label,
					datasetIndex: this.#datasetIndex,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class Outlier extends StatelessWidget {
	#value: number;
	#outlierIndex: number;
	#index: number;
	#legend: string;
	#label: string;
	#datasetIndex: number;

	constructor(props: {
		value: number;
		outlierIndex: number;
		index: number;
		legend: string;
		label: string;
		datasetIndex: number;
	}) {
		super();
		this.#value = props.value;
		this.#outlierIndex = props.outlierIndex;
		this.#index = props.index;
		this.#legend = props.legend;
		this.#label = props.label;
		this.#datasetIndex = props.datasetIndex;
	}

	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		const index = this.#index;
		const legend = this.#legend;
		const value = this.#value;
		const isHovered = ctx.isBoxPlotHovered(index, legend);
		return GestureDetector({
			cursor: "default",
			onMouseEnter: () => ctx.hoverBoxPlot(index, legend, { kind: "outlier", value }),
			onMouseLeave: () => ctx.unhoverBoxPlot({ index, legend, kind: "outlier", value }),
			child: ctx.custom.outlier(
				{
					value,
					outlierIndex: this.#outlierIndex,
					index,
					legend,
					label: this.#label,
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
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.axisCorner(undefined, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
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
		const ctx = BoxPlotChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverBoxPlot(),
			child: ctx.custom.dataView(
				{
					boxPlotGroups: Array.from({ length: ctx.data.labels.length }, (_, index) => {
						return new BoxPlotGroup({
							dataPoints: ctx.data.datasets.map(({ data }) => data[index]),
							index,
						});
					}),
				},
				ctx,
			),
		});
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.grid(
			{ xLine: new GridXLine(), yLine: new GridYLine() },
			ctx,
		);
	}
}

class GridXLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.gridXLine(undefined, ctx);
	}
}

class GridYLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = BoxPlotChartProvider.of(context);
		return ctx.custom.gridYLine(undefined, ctx);
	}
}
