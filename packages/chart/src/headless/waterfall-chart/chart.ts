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
import { WaterfallChartProvider } from "./provider";
import type { WaterfallBarType } from "./types";

const TYPE_LABEL: Record<WaterfallBarType, string> = {
	increase: "Increase",
	decrease: "Decrease",
	total: "Total",
	subtotal: "Subtotal",
};

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

class Bar extends StatefulWidget {
	value: number;
	cumulative: number;
	index: number;
	label: string;
	type: WaterfallBarType;

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
		super(`${index}`);
		this.value = value;
		this.cumulative = cumulative;
		this.index = index;
		this.label = label;
		this.type = type;
	}

	createState() {
		return new BarState();
	}
}

class BarState extends State<Bar> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		const { index, value, cumulative, label, type } = this.widget;
		const isHovered = ctx.isBarHovered(index);
		return GestureDetector({
			cursor: "default",
			key: this.anchorKey,
			onMouseEnter: () => ctx.hoverBar(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBar(index),
			child: ctx.custom.bar(
				{
					value,
					cumulative,
					index,
					label,
					type,
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
				tooltipArea: new TooltipOverlay(),
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

class TooltipOverlay extends StatefulWidget {
	createState() {
		return new TooltipOverlayState();
	}
}

class TooltipOverlayState extends State<TooltipOverlay> {
	overlayKey = new GlobalKey();

	private resolveHoveredBar(
		ctx: ReturnType<typeof WaterfallChartProvider.of>,
	): {
		index: number;
		label: string;
		value: number;
		cumulative: number;
		type: WaterfallBarType;
		x: number;
		y: number;
		width: number;
		height: number;
	} | null {
		const hoveredBar = ctx.hoveredBar;
		if (hoveredBar == null) return null;

		const overlayRenderObject = this.overlayKey.currentContext?.renderObject;
		const barRenderObject = hoveredBar.anchorKey.currentContext?.renderObject;
		if (overlayRenderObject == null || barRenderObject == null) return null;

		const index = hoveredBar.index;
		const barGlobal = barRenderObject.localToGlobal();
		const overlayGlobal = overlayRenderObject.localToGlobal();

		return {
			index,
			label: ctx.data.labels[index] ?? "",
			value: ctx.data.values[index] ?? 0,
			cumulative: ctx.cumulativeValues[index] ?? 0,
			type: ctx.types[index],
			x: barGlobal.x - overlayGlobal.x,
			y: barGlobal.y - overlayGlobal.y,
			width: barRenderObject.size.width,
			height: barRenderObject.size.height,
		};
	}

	override build(context: BuildContext): Widget {
		const ctx = WaterfallChartProvider.of(context);
		const hoveredBarRect = this.resolveHoveredBar(ctx);
		const palette =
			ctx.config?.colors?.fills ??
			ctx.config?.colors ??
			["#888"];

		let tooltip: Widget | null = null;
		if (hoveredBarRect != null) {
			const color = palette[
				hoveredBarRect.type === "increase"
					? 0
					: hoveredBarRect.type === "decrease"
						? 1
						: 2
			] ?? palette[0] ?? "#888";
			tooltip = ctx.custom.tooltip(
				{
					label: hoveredBarRect.label,
					items: [
						{ legend: TYPE_LABEL[hoveredBarRect.type], color, value: hoveredBarRect.value },
						{ legend: "Cumulative", color: ctx.config.axis.color, value: hoveredBarRect.cumulative },
					],
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
					{ tooltip, hoveredBar: hoveredBarRect },
					ctx,
				),
			],
		});
	}
}
