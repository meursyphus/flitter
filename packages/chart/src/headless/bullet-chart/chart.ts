import {
	StatelessWidget,
	StatefulWidget,
	State,
	GlobalKey,
	type Widget,
	type BuildContext,
	SizedBox,
	GestureDetector,
} from "flitter-core";
import {
	createCartesianChart,
	getScaleLabels,
	resolveOverlayRect,
	type CartesianScaffoldBehavior,
} from "@headless/_shared/cartesian-scaffold";
import { BulletChartProvider } from "./provider";

type HoveredBulletRect = {
	index: number;
	label: string;
	value: number;
	target: number;
	ranges: number[];
	x: number;
	y: number;
	width: number;
	height: number;
};

function clampRatio(value: number): number {
	if (!Number.isFinite(value)) return 0;
	if (value <= 0) return 0;
	if (value >= 1) return 1;
	return value;
}

class BulletGroup extends StatefulWidget {
	index: number;

	constructor({ index }: { index: number }) {
		super();
		this.index = index;
	}

	createState() {
		return new BulletGroupState();
	}
}

class BulletGroupState extends State<BulletGroup> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		const { data } = ctx;
		if (ctx.scale == null) return SizedBox.shrink();

		const { index } = this.widget;
		const dataset = data.datasets[index];
		const label = data.labels[index];
		const total = ctx.scale.max - ctx.scale.min || 1;
		const isHovered = ctx.isBulletHovered(index);
		const isDimmed = ctx.hoveredBullet != null && !isHovered;

		const ranges = dataset.ranges
				.slice()
				.sort((a, b) => b - a)
				.map((rangeValue, rangeIndex) => ({
					ratio: clampRatio((rangeValue - ctx.scale!.min) / total),
					widget: new RangeBar({
						rangeValue,
						rangeIndex,
						index,
						label,
						isHovered,
						isDimmed,
					}),
				}));

		const bulletBox = ctx.custom.bulletBox(
			{
				ranges,
				valueBar: new ValueBar({
					value: dataset.value,
					index,
					label,
					isHovered,
					isDimmed,
				}),
				valueRatio: clampRatio((dataset.value - ctx.scale.min) / total),
				targetMarker: new TargetMarker({
					target: dataset.target,
					index,
					label,
					isHovered,
					isDimmed,
				}),
				targetRatio: clampRatio((dataset.target - ctx.scale.min) / total),
				tooltipAnchor: SizedBox({
					key: this.anchorKey,
					width: Infinity,
					height: Infinity,
				}),
				index,
				label,
				value: dataset.value,
				target: dataset.target,
				rangeValues: dataset.ranges,
				isHovered,
				isDimmed,
			},
			ctx,
		);

		return GestureDetector({
			behavior: "translucent",
			cursor: "default",
			onMouseEnter: () => ctx.hoverBullet(index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverBullet(index),
			child: ctx.custom.bulletGroup(
				{
					bulletBox,
					index,
					label,
					isHovered,
					isDimmed,
				},
				ctx,
			),
		});
	}
}

class RangeBar extends StatelessWidget {
	#rangeValue: number;
	#rangeIndex: number;
	#index: number;
	#label: string;
	#isHovered: boolean;
	#isDimmed: boolean;

	constructor({
		rangeValue,
		rangeIndex,
		index,
		label,
		isHovered,
		isDimmed,
	}: {
		rangeValue: number;
		rangeIndex: number;
		index: number;
		label: string;
		isHovered: boolean;
		isDimmed: boolean;
	}) {
		super();
		this.#rangeValue = rangeValue;
		this.#rangeIndex = rangeIndex;
		this.#index = index;
		this.#label = label;
		this.#isHovered = isHovered;
		this.#isDimmed = isDimmed;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		return ctx.custom.rangeBar(
			{
				rangeValue: this.#rangeValue,
				rangeIndex: this.#rangeIndex,
				index: this.#index,
				label: this.#label,
				isHovered: this.#isHovered,
				isDimmed: this.#isDimmed,
			},
			ctx,
		);
	}
}

class ValueBar extends StatelessWidget {
	#value: number;
	#index: number;
	#label: string;
	#isHovered: boolean;
	#isDimmed: boolean;

	constructor({
		value,
		index,
		label,
		isHovered,
		isDimmed,
	}: {
		value: number;
		index: number;
		label: string;
		isHovered: boolean;
		isDimmed: boolean;
	}) {
		super();
		this.#value = value;
		this.#index = index;
		this.#label = label;
		this.#isHovered = isHovered;
		this.#isDimmed = isDimmed;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		return ctx.custom.valueBar(
			{
				value: this.#value,
				index: this.#index,
				label: this.#label,
				isHovered: this.#isHovered,
				isDimmed: this.#isDimmed,
			},
			ctx,
		);
	}
}

class TargetMarker extends StatelessWidget {
	#target: number;
	#index: number;
	#label: string;
	#isHovered: boolean;
	#isDimmed: boolean;

	constructor({
		target,
		index,
		label,
		isHovered,
		isDimmed,
	}: {
		target: number;
		index: number;
		label: string;
		isHovered: boolean;
		isDimmed: boolean;
	}) {
		super();
		this.#target = target;
		this.#index = index;
		this.#label = label;
		this.#isHovered = isHovered;
		this.#isDimmed = isDimmed;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		return ctx.custom.targetMarker(
			{
				target: this.#target,
				index: this.#index,
				label: this.#label,
				isHovered: this.#isHovered,
				isDimmed: this.#isDimmed,
			},
			ctx,
		);
	}
}

const behavior: CartesianScaffoldBehavior<
	ReturnType<typeof BulletChartProvider.of>,
	HoveredBulletRect
> = {
	of: (context) => BulletChartProvider.of(context),
	buildLayout: (ctx, { title, plot, legends }) =>
		ctx.custom.layout({ title, plot, legends }, ctx),
	buildPlot: (ctx, { xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
		ctx.custom.plot(
			{
				xAxis,
				yAxis,
				dataView,
				grid,
				axisCorner,
				tooltipArea: tooltipArea ?? SizedBox.shrink(),
			},
			ctx,
		),
	getLegends: (ctx) =>
		ctx.legends.map((name, index) => ({
			name,
			index,
		})),
	buildLegend: (ctx, { name, index }) =>
		ctx.custom.legend({ name, index }, ctx),
	getXAxisLabels: (ctx) =>
		ctx.direction === "vertical" ? ctx.data.labels : getScaleLabels(ctx.scale),
	getYAxisLabels: (ctx) =>
		ctx.direction === "vertical" ? getScaleLabels(ctx.scale) : ctx.data.labels,
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) =>
		GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverBullet(),
			child: ctx.custom.dataView(
				{
					bulletGroups: Array.from(
						{ length: ctx.data.labels.length },
						(_, index) => new BulletGroup({ index }),
					),
				},
				ctx,
			),
		}),
	tooltip: {
		resolveHovered: (ctx, overlayKey): HoveredBulletRect | null => {
			const hoveredBullet = ctx.hoveredBullet;
			if (hoveredBullet == null) return null;

			const dataset = ctx.data.datasets[hoveredBullet.index];
			const rect = resolveOverlayRect(overlayKey, hoveredBullet.anchorKey);
			if (dataset == null || rect == null) return null;

			return {
				index: hoveredBullet.index,
				label: ctx.data.labels[hoveredBullet.index] ?? "",
				value: dataset.value,
				target: dataset.target,
				ranges: dataset.ranges,
				...rect,
			};
		},
		buildTooltip: (ctx, hoveredBulletRect) =>
			ctx.custom.tooltip(
				{
					label: hoveredBulletRect.label,
					items: [
						{
							legend: "Value",
							color: ctx.config?.bullet?.valueBarColor ?? "#444",
							value: hoveredBulletRect.value,
						},
						{
							legend: "Target",
							color: ctx.config?.bullet?.targetMarkerColor ?? "#222",
							value: hoveredBulletRect.target,
						},
					],
				},
				ctx,
			),
		buildTooltipArea: (ctx, { tooltip, hovered }) =>
			ctx.custom.tooltipArea({ tooltip, hoveredBullet: hovered }, ctx),
	},
};

export default class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return createCartesianChart(behavior);
	}
}
