import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { HeatmapChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx: BuildContext, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new TitleWidget(),
				legend: new LegendWidget(),
				plot: new PlotWidget(),
			},
			ctx,
		);
	}
}

class TitleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class LegendWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.legend(undefined, ctx);
	}
}

class PlotWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.plot(
			{
				xAxis: new XAxis(),
				yAxis: new YAxis(),
				heatmap: new HeatmapWidget(),
				axisCorner: new AxisCorner(),
			},
			ctx,
		);
	}
}

abstract class AxisBase extends StatelessWidget {
	protected getXLabels(context: BuildContext): Widget[] {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.data.xLabels.map(
			(name, index) => new XAxisLabel({ name, index }),
		);
	}

	protected getYLabels(context: BuildContext): Widget[] {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.data.yLabels.map(
			(name, index) => new YAxisLabel({ name, index }),
		);
	}
}

class XAxis extends AxisBase {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.xAxis(
			{
				line: new XAxisLine(),
				labels: this.getXLabels(context),
				tick: new XAxisTick(),
			},
			ctx,
		);
	}
}

class YAxis extends AxisBase {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.yAxis(
			{
				line: new YAxisLine(),
				labels: this.getYLabels(context),
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
		const ctx = HeatmapChartProvider.of(context);
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
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class YAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.yAxisLine(undefined, ctx);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.yAxisTick(undefined, ctx);
	}
}

class AxisCorner extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.axisCorner(undefined, ctx);
	}
}

class HeatmapWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		const segments: Widget[][] = ctx.data.values.map((row, yIndex) =>
			row.map((value, xIndex) => new SegmentWidget({ value, xIndex, yIndex })),
		);
		return ctx.custom.heatmap({ segments }, ctx);
	}
}

class SegmentWidget extends StatelessWidget {
	#value: number;
	#xIndex: number;
	#yIndex: number;

	constructor({
		value,
		xIndex,
		yIndex,
	}: {
		value: number;
		xIndex: number;
		yIndex: number;
	}) {
		super();
		this.#value = value;
		this.#xIndex = xIndex;
		this.#yIndex = yIndex;
	}

	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		return ctx.custom.segment(
			{ value: this.#value, xIndex: this.#xIndex, yIndex: this.#yIndex },
			ctx,
		);
	}
}
