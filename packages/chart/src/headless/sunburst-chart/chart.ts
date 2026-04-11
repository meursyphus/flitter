import {
	StatelessWidget,
	GestureDetector,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { SunburstChartProvider } from "./provider";
import type {
	FlatSegment,
	HoveredSunburstSegment,
	SunburstChartContext,
	SunburstChartSegment,
} from "./types";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
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
		const ctx = SunburstChartProvider.of(context);

		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.rawData.nodes.map(
					(node, index) =>
						new Legend({
							name: node.label,
							index,
						}),
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
		const ctx = SunburstChartProvider.of(context);
		const child = ctx.custom.legend(
			{
				name: this.#name,
				index: this.#index,
				isVisible: ctx.isLegendVisible(this.#index),
			},
			ctx,
		);

		return GestureDetector({
			onClick: () => ctx.toggleLegend(this.#index),
			child,
		});
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return ctx.custom.dataView({ segments: buildSunburstData(ctx) }, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);

		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllSegments(),
			child: ctx.custom.plot(
				{
					dataView: new DataView(),
					tooltipArea: new TooltipArea(),
				},
				ctx,
			),
		});
	}
}

class TooltipArea extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);

		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				const hoveredSegment = resolveHoveredSegment(
					ctx,
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
	#segment: FlatSegment;

	constructor({ segment }: { segment: FlatSegment }) {
		super();
		this.#segment = segment;
	}

	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		const isHovered = ctx.isSegmentHovered(this.#segment.key);
		const dataLabel = ctx.custom.dataLabel(
			{
				...this.#segment,
				isHovered,
			},
			ctx,
		);
		const child = ctx.custom.segment(
			{
				...this.#segment,
				dataLabel,
				isHovered,
			},
			ctx,
		);

		return GestureDetector({
			behavior: "deferToChild",
			cursor: "default",
			onMouseEnter: () => ctx.hoverSegment(this.#segment.key),
			onMouseLeave: () => ctx.unhoverSegment(this.#segment.key),
			child,
		});
	}
}

function buildSunburstData(
	ctx: SunburstChartContext<any>,
): SunburstChartSegment[] {
	return ctx.segments.map((segment) => ({
		...segment,
		widget: new Segment({ segment }),
	}));
}

function resolveHoveredSegment(
	ctx: SunburstChartContext<any>,
	width: number,
	height: number,
): HoveredSunburstSegment | null {
	const segment = ctx.hoveredSegment;
	if (segment == null) return null;
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
		return null;
	}

	const maxDepth = ctx.segments.reduce((max, entry) => Math.max(max, entry.depth), 0);
	if (maxDepth <= 0) return null;

	const cx = width / 2;
	const cy = height / 2;
	const maxRadius = Math.min(cx, cy) - 10;
	if (maxRadius <= 0) return null;

	const innerRadiusRatio = ctx.config?.sunburst?.innerRadiusRatio ?? 0.18;
	const innerRadius = maxRadius * innerRadiusRatio;
	const ringWidth = (maxRadius - innerRadius) / maxDepth;
	const r1 = innerRadius + (segment.depth - 1) * ringWidth;
	const r2 = innerRadius + segment.depth * ringWidth;
	const anchorRadius = (r1 + r2) / 2;
	const midAngle = -Math.PI / 2 + segment.startAngle + segment.sweepAngle / 2;
	const directionX = Math.cos(midAngle);
	const directionY = Math.sin(midAngle);

	return {
		...segment,
		midAngle,
		anchorX: cx + anchorRadius * directionX,
		anchorY: cy + anchorRadius * directionY,
		directionX,
		directionY,
	};
}
