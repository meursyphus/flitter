import {
	AnimatedBaseWidgetState,
	Curves,
	ImplicitlyAnimatedWidget,
	Stack,
	StackFit,
	Tween,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { Data, Nullable } from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";
import { Slice } from "../../../base/slice";

const TOAST_SLICE_PADDING = 0;

class AnimatedToastSlice extends ImplicitlyAnimatedWidget {
	index: number;
	name: string;
	startAngle: number;
	sweepAngle: number;
	dataLabel: Widget;
	context: Parameters<PieChartCustom<ToastPieChartConfig>["slice"]>[1];
	isHovered: boolean;

	constructor({
		index,
		name,
		startAngle,
		sweepAngle,
		dataLabel,
		context,
		isHovered,
		duration,
	}: {
		index: number;
		name: string;
		startAngle: number;
		sweepAngle: number;
		dataLabel: Widget;
		context: Parameters<PieChartCustom<ToastPieChartConfig>["slice"]>[1];
		isHovered: boolean;
		duration: number;
	}) {
		super({
			duration,
			curve: Curves.easeInOut,
		});
		this.index = index;
		this.name = name;
		this.startAngle = startAngle;
		this.sweepAngle = sweepAngle;
		this.dataLabel = dataLabel;
		this.context = context;
		this.isHovered = isHovered;
	}

	createState(): AnimatedBaseWidgetState<AnimatedToastSlice> {
		return new AnimatedToastSliceState();
	}
}

class AnimatedToastSliceState extends AnimatedBaseWidgetState<AnimatedToastSlice> {
	private startAngleTween: Tween<number> | Nullable = null;
	private sweepAngleTween: Tween<number> | Nullable = null;

	forEachTween(
		visitor: <V extends number | Data, T extends Tween<V>>(props: {
			tween: T;
			targetValue: V;
			constructor: (value: V) => T;
		}) => T,
	): void {
		this.startAngleTween = visitor({
			tween: this.startAngleTween as Tween<number>,
			targetValue: this.widget.startAngle,
			constructor: (value) => new Tween({ begin: value }),
		}) as Tween<number>;
		this.sweepAngleTween = visitor({
			tween: this.sweepAngleTween as Tween<number>,
			targetValue: this.widget.sweepAngle,
			constructor: (value) => new Tween({ begin: value }),
		}) as Tween<number>;
	}

	build(): Widget {
		const ctx = this.widget.context;
		const { colors, pie: pieConfig } = ctx.config;
		const colorIndex = ctx.legends.indexOf(this.widget.name);
		const color = colors[(colorIndex >= 0 ? colorIndex : this.widget.index) % colors.length];
		const hovered = this.widget.isHovered;
		const startAngle = this.startAngleTween?.evaluate(this.animation) ?? this.widget.startAngle;
		const sweepAngle = this.sweepAngleTween?.evaluate(this.animation) ?? this.widget.sweepAngle;

		const slice = Slice({
			index: this.widget.index,
			startAngle,
			sweepAngle,
			innerRadiusRatio: pieConfig.innerRadiusRatio,
			padding: TOAST_SLICE_PADDING,
			ctx,
			fill: color,
			strokeColor: hovered ? "white" : "transparent",
			strokeWidth: hovered ? 4 : 0,
			svgFilter: hovered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : undefined,
		});

		return ZIndex({
			zIndex: hovered ? 9999 : 0,
			child: Stack({
				fit: StackFit.expand,
				clipped: false,
				children: [slice, this.widget.dataLabel],
			}),
		});
	}
}

export function toastSlice(
	...[{ index, name, startAngle, sweepAngle, dataLabel, isHovered }, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["slice"]>
): Widget {
	const duration = ctx.config.animation.enabled ? ctx.config.animation.duration : 0;

	return new AnimatedToastSlice({
		index,
		name,
		startAngle,
		sweepAngle,
		dataLabel,
		context: ctx,
		isHovered,
		duration,
	});
}
