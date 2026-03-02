import {
	StatefulWidget,
	State,
	AnimationController,
	CurvedAnimation,
	Curves,
	Tween,
	ClipPath,
	Path,
	Offset,
	Radius,
	Stack,
	StackFit,
	Align,
	Alignment,
	ConstraintsTransformBox,
	FractionalTranslation,
	ZIndex,
	SizedBox,
	type Widget,
} from "flitter-core";
import type { PieChartCustom, PieChartContext } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";
import { Series } from "../../../base/series";
import { tooltipContent } from "@styles/toast";

type PieSlice = {
	widget: Widget;
	startAngle: number;
	sweepAngle: number;
	percentage: number;
	index: number;
	name: string;
	value: number;
};

type AngleSnapshot = { startAngle: number; sweepAngle: number };

class AnimatedPieSeries extends StatefulWidget {
	pies: PieSlice[];
	context: PieChartContext<ToastPieChartConfig>;
	duration: number;

	constructor({
		pies,
		context,
		duration,
	}: {
		pies: PieSlice[];
		context: PieChartContext<ToastPieChartConfig>;
		duration: number;
	}) {
		super();
		this.pies = pies;
		this.context = context;
		this.duration = duration;
	}

	createState() {
		return new _AnimatedPieSeriesState();
	}
}

class _AnimatedPieSeriesState extends State<AnimatedPieSeries> {
	controller!: AnimationController;
	tween!: { value: number };
	isMountAnimation = true;
	prevAngleMap: Map<string, AngleSnapshot> | null = null;

	override initState() {
		this.controller = new AnimationController({
			duration: this.widget.duration,
		});
		this.controller.addListener(() => this.setState());
		this.tween = new Tween({ begin: 0, end: 1 }).animated(
			new CurvedAnimation({
				parent: this.controller,
				curve: Curves.easeInOut,
			}),
		);
		this.isMountAnimation = true;
		this.controller.forward();
	}

	override didUpdateWidget(oldWidget: AnimatedPieSeries) {
		const anglesChanged =
			oldWidget.pies.length !== this.widget.pies.length ||
			oldWidget.pies.some(
				(p, i) =>
					p.startAngle !== this.widget.pies[i]?.startAngle ||
					p.sweepAngle !== this.widget.pies[i]?.sweepAngle,
			);

		if (anglesChanged) {
			this.prevAngleMap = new Map(
				oldWidget.pies.map((p) => [
					p.name,
					{ startAngle: p.startAngle, sweepAngle: p.sweepAngle },
				]),
			);
			this.isMountAnimation = false;
			this.controller.reset();
			this.controller.forward();
		}
	}

	override dispose() {
		this.controller.dispose();
	}

	override build() {
		const { pies, context } = this.widget;
		const t = this.tween.value;

		if (this.isMountAnimation) {
			// Mount animation: ClipPath sweep from 0 → 360°
			const child = buildSeriesTooltipOverlay(
				Series({ pies }, context),
				{ pies },
				context,
			);
			const done = t >= 1;

			return ClipPath({
				clipped: !done,
				clipper: (size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const r = Math.max(size.width, size.height);
					const sweepAngle = t * Math.PI * 2;

					const path = new Path();
					path.moveTo(new Offset({ x: cx, y: cy }));
					// 12시 방향 (top center)
					path.lineTo(new Offset({ x: cx, y: cy - r }));
					if (sweepAngle > 0) {
						// startAngle = -PI/2 (12시), sweep clockwise
						const startAngle = -Math.PI / 2;
						const endAngle = startAngle + sweepAngle;
						const endX = cx + r * Math.cos(endAngle);
						const endY = cy + r * Math.sin(endAngle);
						path.arcToPoint({
							endPoint: new Offset({ x: endX, y: endY }),
							radius: Radius.circular(r),
							rotation: 0,
							largeArc: sweepAngle > Math.PI,
							clockwise: true,
						});
					}
					path.close();
					return path;
				},
				child,
			});
		}

		// Filter transition: lerp angles for remaining slices
		const interpolatedPies = pies.map((pie) => {
			const prev = this.prevAngleMap?.get(pie.name);
			if (prev == null) return pie;
			return {
				...pie,
				startAngle: lerp(prev.startAngle, pie.startAngle, t),
				sweepAngle: lerp(prev.sweepAngle, pie.sweepAngle, t),
			};
		});

		const seriesWidget = Series({ pies: interpolatedPies }, context);
		return buildSeriesTooltipOverlay(seriesWidget, { pies }, context);
	}
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function toastSeries(
	...[args, context]: Parameters<PieChartCustom<ToastPieChartConfig>["series"]>
): Widget {
	if (!context.config.animation.enabled) {
		const seriesWidget = Series(args, context);
		const child = buildSeriesTooltipOverlay(seriesWidget, args, context);
		return child;
	}

	return new AnimatedPieSeries({
		pies: args.pies,
		context,
		duration: context.config.animation.duration,
	});
}

function buildSeriesTooltipOverlay(
	seriesWidget: Widget,
	args: Parameters<PieChartCustom<ToastPieChartConfig>["series"]>[0],
	context: Parameters<PieChartCustom<ToastPieChartConfig>["series"]>[1],
): Widget {
	const { hoveredIndex, config } = context;
	const showTooltip = hoveredIndex != null && config.tooltip.enabled;

	let tooltipWidget: Widget;

	if (showTooltip && args.pies[hoveredIndex]) {
		const { startAngle, sweepAngle, name, value } = args.pies[hoveredIndex];
		const colorIndex = context.legends.indexOf(name);
		const color = config.colors[(colorIndex >= 0 ? colorIndex : 0) % config.colors.length];

		// actual mid angle in world space: slice draws from -π/2 inside rotated frame
		const midAngle = -Math.PI / 2 + startAngle + sweepAngle / 2;

		const ax = Math.cos(midAngle);
		const ay = Math.sin(midAngle);

		tooltipWidget = ZIndex({
			zIndex: 99999,
			child: Align({
				alignment: new Alignment({ x: ax, y: ay }),
				child: ConstraintsTransformBox({
					constraintsTransform: ConstraintsTransformBox.unconstrained,
					alignment: new Alignment({ x: -ax, y: -ay }),
					child: FractionalTranslation({
						translation: new Offset({ x: ax * 0.15, y: ay * 0.15 }),
						child: tooltipContent({
							label: name,
							items: { legend: name, color, value },
							config,
						}),
					}),
				}),
			}),
		});
	} else {
		tooltipWidget = SizedBox.shrink();
	}

	// Always return Stack to keep widget tree structure stable (prevents remount flicker)
	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [seriesWidget, tooltipWidget],
	});
}
