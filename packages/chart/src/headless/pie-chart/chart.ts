import {
	StatelessWidget,
	GestureDetector,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { PieChartProvider } from "./provider";
import type {
	HoveredPieChartSegment,
	PieChartContext,
	PieChartRadialItem,
	PieChartSegment,
	PieChartSegmentArgs,
} from "./types";
import {
	buildPieLikeSegmentMeta,
	resolveHoveredPieLikeSegmentAnchor,
	type PieLikeSegmentMeta,
} from "@shared/pie-like";

type PieSegmentMeta = PieChartSegmentArgs & { angle: number };

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
		const segments = buildPieData(ctx);

		return ctx.custom.dataView({ segments }, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllSegments(),
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
		const segments = buildPieSegments(ctx);

		return LayoutBuilder({
			builder: (_ctx: BuildContext, constraints) => {
				const hoveredSegment = resolveHoveredSegment(
					ctx,
					segments,
					constraints.maxWidth,
					constraints.maxHeight,
				);
				const tooltip =
					hoveredSegment == null ? null : ctx.custom.tooltip(hoveredSegment, ctx);

				return ctx.custom.tooltipArea({ tooltip, hoveredSegment }, ctx);
			},
		});
	}
}

class Segment extends StatelessWidget {
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
	}: PieSegmentMeta & { dataLabel: Widget }) {
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
		const isHovered = ctx.isSegmentHovered(this.#index);
		const child = ctx.custom.segment(
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
			onMouseEnter: () => ctx.hoverSegment(this.#index),
			onMouseLeave: () => ctx.unhoverSegment(this.#index),
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

	constructor({ index, name, value, percentage, angle }: Pick<PieSegmentMeta, "index" | "name" | "value" | "percentage" | "angle">) {
		super();
		this.#index = index;
		this.#name = name;
		this.#value = value;
		this.#percentage = percentage;
		this.#angle = angle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const isHovered = ctx.isSegmentHovered(this.#index);
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
			onMouseEnter: () => ctx.hoverSegment(this.#index),
			onMouseLeave: () => ctx.unhoverSegment(this.#index),
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

	constructor({ index, name, value, percentage, angle }: Pick<PieSegmentMeta, "index" | "name" | "value" | "percentage" | "angle">) {
		super();
		this.#index = index;
		this.#name = name;
		this.#value = value;
		this.#percentage = percentage;
		this.#angle = angle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const isHovered = ctx.isSegmentHovered(this.#index);
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
			onMouseEnter: () => ctx.hoverSegment(this.#index),
			onMouseLeave: () => ctx.unhoverSegment(this.#index),
			child,
		});
	}
}

function buildPieSegments(ctx: PieChartContext<any>): PieSegmentMeta[] {
	return buildPieLikeSegmentMeta(ctx.data) as PieLikeSegmentMeta[] as PieSegmentMeta[];
}

function buildPieData(ctx: PieChartContext<any>): PieChartSegment[] {
	const segmentMeta = buildPieSegments(ctx);

	return segmentMeta.map((segment) => {
		const dataLabel = ctx.custom.dataLabel(
			{
				index: segment.index,
				name: segment.name,
				value: segment.value,
				percentage: segment.percentage,
				startAngle: segment.startAngle,
				sweepAngle: segment.sweepAngle,
			},
			ctx,
		);

		return {
			index: segment.index,
			name: segment.name,
			value: segment.value,
			percentage: segment.percentage,
			startAngle: segment.startAngle,
			sweepAngle: segment.sweepAngle,
			widget: new Segment({ ...segment, dataLabel }),
		};
	});
}

function buildRadialItems(ctx: PieChartContext<any>): PieChartRadialItem[] {
	return buildPieSegments(ctx).map((segment) => ({
		angle: segment.angle,
		tick: new RadialTick(segment),
		label: new RadialLabel(segment),
	}));
}

function resolveHoveredSegment(
	ctx: PieChartContext<any>,
	segments: PieSegmentMeta[],
	width: number,
	height: number,
): HoveredPieChartSegment | null {
	return resolveHoveredPieLikeSegmentAnchor({
		segments,
		hoveredIndex: ctx.hoveredIndex,
		width,
		height,
		innerRadiusRatio: ctx.config?.pie?.innerRadiusRatio ?? 0,
	}) as HoveredPieChartSegment | null;
}
