import {
	StatelessWidget,
	GestureDetector,
	Stack,
	StackFit,
	SizedBox,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { PieChartProvider } from "./provider";
import type {
	HoveredPieSlice,
	PieChartContext,
	PieChartSlice,
} from "./types";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
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
		const ctx = PieChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.legends.map(
					(name, index) => new Legend({ name, index }),
				),
				dataView: new DataView(),
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
		const ctx = PieChartProvider.of(context);
		const child = ctx.custom.legend(
			{
				name: this.#name,
				index: this.#index,
				isVisible: ctx.isSeriesVisible(this.#name),
			},
			ctx,
		);

		return GestureDetector({
			onClick: () => ctx.toggleSeries(this.#name),
			child,
		});
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const { slices, dataLabels } = buildPieData(ctx);

		return LayoutBuilder({
			builder: (_ctx: BuildContext, constraints) => {
				const hoveredSlice = resolveHoveredSlice(
					ctx,
					slices,
					constraints.maxWidth,
					constraints.maxHeight,
				);
				const tooltip =
					hoveredSlice == null ? null : ctx.custom.tooltip(hoveredSlice, ctx);
				const dataView = ctx.custom.dataView({ slices, dataLabels }, ctx);

				return GestureDetector({
					behavior: "translucent",
					onMouseLeave: () => ctx.unhoverAllSlices(),
					child: Stack({
						fit: StackFit.expand,
						clipped: false,
						children: [
							dataView,
							ctx.custom.tooltipArea({ tooltip, hoveredSlice }, ctx),
						],
					}),
				});
			},
		});
	}
}

class Slice extends StatelessWidget {
	#index: number;
	#name: string;
	#value: number;
	#percentage: number;
	#startAngle: number;
	#sweepAngle: number;

	constructor({
		index,
		name,
		value,
		percentage,
		startAngle,
		sweepAngle,
	}: Omit<PieChartSlice, "widget">) {
		super();
		this.#index = index;
		this.#name = name;
		this.#value = value;
		this.#percentage = percentage;
		this.#startAngle = startAngle;
		this.#sweepAngle = sweepAngle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const child = ctx.custom.slice(
			{
				index: this.#index,
				name: this.#name,
				value: this.#value,
				percentage: this.#percentage,
				startAngle: this.#startAngle,
				sweepAngle: this.#sweepAngle,
			},
			ctx,
		);

		return GestureDetector({
			behavior: "deferToChild",
			cursor: "default",
			onMouseEnter: () => ctx.hoverSlice(this.#index),
			onMouseLeave: () => ctx.unhoverSlice(this.#index),
			child,
		});
	}
}

function buildPieData(ctx: PieChartContext<any>): {
	slices: PieChartSlice[];
	dataLabels: Widget[];
} {
	const { data } = ctx;
	const total = data.datasets.reduce((sum, dataset) => sum + dataset.value, 0);
	let currentAngle = 0;

	const slices = data.datasets.map((dataset, index) => {
		const percentage = total > 0 ? (dataset.value / total) * 100 : 0;
		const sweepAngle = total > 0 ? (dataset.value / total) * Math.PI * 2 : 0;
		const startAngle = currentAngle;
		currentAngle += sweepAngle;

		return {
			widget: new Slice({
				index,
				name: dataset.name,
				value: dataset.value,
				percentage,
				startAngle,
				sweepAngle,
			}),
			startAngle,
			sweepAngle,
			percentage,
			index,
			name: dataset.name,
			value: dataset.value,
		};
	});

	const dataLabels = data.datasets.map((dataset, index) => {
		const percentage = slices[index]?.percentage ?? 0;
		const startAngle = slices[index]?.startAngle ?? 0;
		const sweepAngle = slices[index]?.sweepAngle ?? 0;
		return ctx.custom.dataLabel(
			{
				index,
				name: dataset.name,
				value: dataset.value,
				percentage,
				startAngle,
				sweepAngle,
			},
			ctx,
		);
	});

	return { slices, dataLabels };
}

function resolveHoveredSlice(
	ctx: PieChartContext<any>,
	slices: PieChartSlice[],
	width: number,
	height: number,
): HoveredPieSlice | null {
	const hoveredIndex = ctx.hoveredIndex;
	if (hoveredIndex == null || hoveredIndex >= slices.length) return null;
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
		return null;
	}

	const slice = slices[hoveredIndex];
	const outerRadius = Math.min(width, height) / 2;
	const innerRadius = outerRadius * (ctx.config?.pie?.innerRadiusRatio ?? 0);
	const anchorRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const midAngle = -Math.PI / 2 + slice.startAngle + slice.sweepAngle / 2;
	const directionX = Math.cos(midAngle);
	const directionY = Math.sin(midAngle);

	return {
		index: slice.index,
		name: slice.name,
		value: slice.value,
		percentage: slice.percentage,
		startAngle: slice.startAngle,
		sweepAngle: slice.sweepAngle,
		midAngle,
		anchorX: width / 2 + anchorRadius * directionX,
		anchorY: height / 2 + anchorRadius * directionY,
		directionX,
		directionY,
	};
}
