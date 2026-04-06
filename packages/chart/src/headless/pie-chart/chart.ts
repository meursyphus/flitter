import {
	StatelessWidget,
	GestureDetector,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { PieChartProvider } from "./provider";
import type {
	HoveredPieSlice,
	PieChartContext,
	PieChartRadialItem,
	PieChartSlice,
	PieChartSliceArgs,
} from "./types";

type PieSliceMeta = PieChartSliceArgs & { angle: number };

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
				plot: new Plot(),
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
		const slices = buildPieData(ctx);

		return ctx.custom.dataView({ slices }, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllSlices(),
			child: ctx.custom.plot(
				{
					dataView: new DataView(),
					tooltipArea: new TooltipArea(),
					radialItems: buildRadialItems(ctx),
				},
				ctx,
			),
		});
	}
}

class TooltipArea extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const slices = buildPieSlices(ctx);

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

				return ctx.custom.tooltipArea({ tooltip, hoveredSlice }, ctx);
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
	#dataLabel: Widget;

	constructor({
		index,
		name,
		value,
		percentage,
		startAngle,
		sweepAngle,
		dataLabel,
	}: PieSliceMeta & { dataLabel: Widget }) {
		super();
		this.#index = index;
		this.#name = name;
		this.#value = value;
		this.#percentage = percentage;
		this.#startAngle = startAngle;
		this.#sweepAngle = sweepAngle;
		this.#dataLabel = dataLabel;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const isHovered = ctx.isSliceHovered(this.#index);
		const child = ctx.custom.slice(
			{
				index: this.#index,
				name: this.#name,
				value: this.#value,
				percentage: this.#percentage,
				startAngle: this.#startAngle,
				sweepAngle: this.#sweepAngle,
				dataLabel: this.#dataLabel,
				isHovered,
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

class RadialTick extends StatelessWidget {
	#index: number;
	#name: string;
	#value: number;
	#percentage: number;
	#angle: number;

	constructor({ index, name, value, percentage, angle }: Pick<PieSliceMeta, "index" | "name" | "value" | "percentage" | "angle">) {
		super();
		this.#index = index;
		this.#name = name;
		this.#value = value;
		this.#percentage = percentage;
		this.#angle = angle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const isHovered = ctx.isSliceHovered(this.#index);
		const child = ctx.custom.radialTick(
			{
				index: this.#index,
				name: this.#name,
				value: this.#value,
				percentage: this.#percentage,
				angle: this.#angle,
				isHovered,
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

class RadialLabel extends StatelessWidget {
	#index: number;
	#name: string;
	#value: number;
	#percentage: number;
	#angle: number;

	constructor({ index, name, value, percentage, angle }: Pick<PieSliceMeta, "index" | "name" | "value" | "percentage" | "angle">) {
		super();
		this.#index = index;
		this.#name = name;
		this.#value = value;
		this.#percentage = percentage;
		this.#angle = angle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const isHovered = ctx.isSliceHovered(this.#index);
		const child = ctx.custom.radialLabel(
			{
				index: this.#index,
				name: this.#name,
				value: this.#value,
				percentage: this.#percentage,
				angle: this.#angle,
				isHovered,
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

function buildPieSlices(ctx: PieChartContext<any>): PieSliceMeta[] {
	const { data } = ctx;
	const total = data.datasets.reduce((sum, dataset) => sum + dataset.value, 0);
	let currentAngle = 0;

	return data.datasets.map((dataset, index) => {
		const percentage = total > 0 ? (dataset.value / total) * 100 : 0;
		const sweepAngle = total > 0 ? (dataset.value / total) * Math.PI * 2 : 0;
		const startAngle = currentAngle;
		const angle = -Math.PI / 2 + startAngle + sweepAngle / 2;
		currentAngle += sweepAngle;

		return {
			index,
			name: dataset.name,
			value: dataset.value,
			percentage,
			startAngle,
			sweepAngle,
			angle,
		};
	});
}

function buildPieData(ctx: PieChartContext<any>): PieChartSlice[] {
	const sliceMeta = buildPieSlices(ctx);

	return sliceMeta.map((slice) => {
		const dataLabel = ctx.custom.dataLabel(
			{
				index: slice.index,
				name: slice.name,
				value: slice.value,
				percentage: slice.percentage,
				startAngle: slice.startAngle,
				sweepAngle: slice.sweepAngle,
			},
			ctx,
		);

		return {
			index: slice.index,
			name: slice.name,
			value: slice.value,
			percentage: slice.percentage,
			startAngle: slice.startAngle,
			sweepAngle: slice.sweepAngle,
			widget: new Slice({ ...slice, dataLabel }),
		};
	});
}

function buildRadialItems(ctx: PieChartContext<any>): PieChartRadialItem[] {
	return buildPieSlices(ctx).map((slice) => ({
		angle: slice.angle,
		tick: new RadialTick(slice),
		label: new RadialLabel(slice),
	}));
}

function resolveHoveredSlice(
	ctx: PieChartContext<any>,
	slices: PieSliceMeta[],
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
	const midAngle = slice.angle;
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
