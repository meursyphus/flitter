import {
	StatefulWidget,
	State,
	GlobalKey,
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	GestureDetector,
	SizedBox,
	Stack,
	StackFit,
} from "flitter-core";
import { resolveOverlayRect } from "@headless/_shared/cartesian-scaffold";
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
				dataView: new HeatmapWidget(),
				axisCorner: new AxisCorner(),
				tooltipArea: new TooltipArea(),
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
		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllSegments(),
			child: ctx.custom.dataView({ segments }, ctx),
		});
	}
}

class TooltipArea extends StatefulWidget {
	createState() {
		return new TooltipAreaState();
	}
}

class TooltipAreaState extends State<TooltipArea> {
	overlayKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		const hoveredSegment = ctx.hoveredSegment;
		const anchorKey = ctx.hoveredSegmentAnchorKey;
		const rect =
			hoveredSegment == null || anchorKey == null
				? null
				: resolveOverlayRect(this.overlayKey, anchorKey);
		const resolvedHoveredSegment =
			hoveredSegment == null || rect == null
				? null
				: { ...hoveredSegment, ...rect };
		const tooltip =
			hoveredSegment == null
				? null
				: ctx.custom.tooltip(
						{
							label: `${hoveredSegment.xLabel}, ${hoveredSegment.yLabel}`,
							items: [
								{
									legend: "Value",
									color: "#888",
									value: hoveredSegment.value,
								},
							],
						},
						ctx,
					);

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				SizedBox({ key: this.overlayKey, width: Infinity, height: Infinity }),
				ctx.custom.tooltipArea(
					{ tooltip, hoveredSegment: resolvedHoveredSegment },
					ctx,
				),
			],
		});
	}
}

class SegmentWidget extends StatefulWidget {
	value: number;
	xIndex: number;
	yIndex: number;

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
		this.value = value;
		this.xIndex = xIndex;
		this.yIndex = yIndex;
	}

	createState() {
		return new SegmentWidgetState();
	}
}

class SegmentWidgetState extends State<SegmentWidget> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = HeatmapChartProvider.of(context);
		const { value, xIndex, yIndex } = this.widget;
		const isHovered = ctx.isSegmentHovered(xIndex, yIndex);
		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () => ctx.hoverSegment(xIndex, yIndex, this.anchorKey),
			onMouseLeave: () => ctx.unhoverSegment(xIndex, yIndex),
			child: ctx.custom.segment({ value, xIndex, yIndex, isHovered }, ctx),
		});
	}
}
