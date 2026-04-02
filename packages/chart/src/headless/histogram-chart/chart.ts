import {
	StatelessWidget,
	StatefulWidget,
	State,
	GlobalKey,
	Stack,
	StackFit,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	SizedBox,
	GestureDetector,
} from "flitter-core";
import { HistogramChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
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
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				plot: new Plot(),
			},
			ctx,
		);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

abstract class Axis extends StatelessWidget {
	protected getValueLabels(context: BuildContext): string[] {
		const { scale } = HistogramChartProvider.of(context);
		if (scale == null) return [];
		const labels = [];
		for (let index = 0; index <= (scale.max - scale.min) / scale.step; index++) {
			labels.push(scale.min + scale.step * index);
		}
		return labels.map((label) => label.toString());
	}
}

class XAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.xAxis(
			{
				labels: ctx.bins.map(
					(bin, index) => new XAxisLabel({ index, name: bin.label }),
				),
				tick: new XAxisTick(),
				line: new XAxisLine(),
			},
			ctx,
		);
	}
}

class YAxis extends Axis {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
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

class XAxisLabel extends StatelessWidget {
	#index: number;
	#name: string;

	constructor({ index, name }: { index: number; name: string }) {
		super();
		this.#index = index;
		this.#name = name;
	}

	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
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
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class YAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.yAxisTick(undefined, ctx);
	}
}

class XAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class YAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.yAxisLine(undefined, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.plot(
			{
				xAxis: new XAxis(),
				yAxis: new YAxis(),
				dataView: new DataView(),
				grid: new Grid(),
				axisCorner: new AxisCorner(),
				tooltipArea: new TooltipOverlay(),
			},
			ctx,
		);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllBins(),
			child: ctx.custom.dataView(
				{
					bars: ctx.bins.map(
						(bin, index) =>
							new Bar({
								binMin: bin.min,
								binMax: bin.max,
								count: bin.count,
								index,
							}),
					),
				},
				ctx,
			),
		});
	}
}

class Bar extends StatefulWidget {
	binMin: number;
	binMax: number;
	count: number;
	index: number;

	constructor(props: { binMin: number; binMax: number; count: number; index: number }) {
		super(`${props.index}`);
		this.binMin = props.binMin;
		this.binMax = props.binMax;
		this.count = props.count;
		this.index = props.index;
	}

	createState() {
		return new BarState();
	}
}

class BarState extends State<Bar> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		const { index, binMin, binMax, count } = this.widget;
		const isHovered = ctx.isBinHovered(index);
		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () => ctx.hoverBin(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBin(index),
			child: ctx.custom.bar(
				{
					binMin,
					binMax,
					count,
					index,
					isHovered,
				},
				ctx,
			),
		});
	}
}

class TooltipOverlay extends StatefulWidget {
	createState() {
		return new TooltipOverlayState();
	}
}

class TooltipOverlayState extends State<TooltipOverlay> {
	overlayKey = new GlobalKey();

	private resolveHoveredBin(
		ctx: ReturnType<typeof HistogramChartProvider.of>,
	): {
		index: number;
		binMin: number;
		binMax: number;
		count: number;
		label: string;
		x: number;
		y: number;
		width: number;
		height: number;
	} | null {
		const hoveredBin = ctx.hoveredBin;
		if (hoveredBin == null) return null;

		const bin = ctx.bins[hoveredBin.index];
		const overlayRenderObject = this.overlayKey.currentContext?.renderObject;
		const barRenderObject = hoveredBin.anchorKey.currentContext?.renderObject;
		if (bin == null || overlayRenderObject == null || barRenderObject == null) return null;

		const barGlobal = barRenderObject.localToGlobal();
		const overlayGlobal = overlayRenderObject.localToGlobal();

		return {
			index: hoveredBin.index,
			binMin: bin.min,
			binMax: bin.max,
			count: bin.count,
			label: `${bin.min.toFixed(1)} - ${bin.max.toFixed(1)}`,
			x: barGlobal.x - overlayGlobal.x,
			y: barGlobal.y - overlayGlobal.y,
			width: barRenderObject.size.width,
			height: barRenderObject.size.height,
		};
	}

	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		const hoveredBinRect = this.resolveHoveredBin(ctx);
		const colors =
			ctx.config?.colors?.fills ??
			ctx.config?.colors ??
			["#888"];

		let tooltip: Widget | null = null;
		if (hoveredBinRect != null) {
			const color = colors[0] ?? "#888";
			tooltip = ctx.custom.tooltip(
				{
					label: hoveredBinRect.label,
					items: [{ legend: "Count", color, value: hoveredBinRect.count }],
				},
				ctx,
			);
		}

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				SizedBox({ key: this.overlayKey, width: Infinity, height: Infinity }),
				ctx.custom.tooltipArea(
					{ tooltip, hoveredBin: hoveredBinRect },
					ctx,
				),
			],
		});
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.grid(
			{ xLine: new GridXLine(), yLine: new GridYLine() },
			ctx,
		);
	}
}

class GridXLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.gridXLine(undefined, ctx);
	}
}

class GridYLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.gridYLine(undefined, ctx);
	}
}

class AxisCorner extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = HistogramChartProvider.of(context);
		return ctx.custom.axisCorner(undefined, ctx);
	}
}
