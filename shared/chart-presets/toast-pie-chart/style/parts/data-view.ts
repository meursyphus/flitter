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
	type Widget,
} from "flitter-core";
import type { PieChartCustom, PieChartSlice } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "../config";
import { DataView } from "../../base/data-view";

type AngleSnapshot = { startAngle: number; sweepAngle: number };

class AnimatedPieDataView extends StatefulWidget {
	pies: PieChartSlice[];
	dataLabels: Widget[];
	context: Parameters<PieChartCustom<ToastPieChartConfig>["dataView"]>[1];
	duration: number;

	constructor({
		pies,
		dataLabels,
		context,
		duration,
	}: {
		pies: PieChartSlice[];
		dataLabels: Widget[];
		context: Parameters<PieChartCustom<ToastPieChartConfig>["dataView"]>[1];
		duration: number;
	}) {
		super();
		this.pies = pies;
		this.dataLabels = dataLabels;
		this.context = context;
		this.duration = duration;
	}

	createState() {
		return new _AnimatedPieDataViewState();
	}
}

class _AnimatedPieDataViewState extends State<AnimatedPieDataView> {
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

	override didUpdateWidget(oldWidget: AnimatedPieDataView) {
		const anglesChanged =
			oldWidget.pies.length !== this.widget.pies.length ||
			oldWidget.pies.some(
				(pie, index) =>
					pie.startAngle !== this.widget.pies[index]?.startAngle ||
					pie.sweepAngle !== this.widget.pies[index]?.sweepAngle,
			);

		if (anglesChanged) {
			this.prevAngleMap = new Map(
				oldWidget.pies.map((pie) => [
					pie.name,
					{ startAngle: pie.startAngle, sweepAngle: pie.sweepAngle },
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
		const { pies, dataLabels, context } = this.widget;
		const t = this.tween.value;

		if (this.isMountAnimation) {
			const child = DataView({ slices: pies, dataLabels }, context);
			const done = t >= 1;

			return ClipPath({
				clipped: !done,
				clipper: (size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.max(size.width, size.height);
					const sweepAngle = t * Math.PI * 2;

					const path = new Path();
					path.moveTo(new Offset({ x: cx, y: cy }));
					path.lineTo(new Offset({ x: cx, y: cy - radius }));
					if (sweepAngle > 0) {
						const startAngle = -Math.PI / 2;
						const endAngle = startAngle + sweepAngle;
						const endX = cx + radius * Math.cos(endAngle);
						const endY = cy + radius * Math.sin(endAngle);
						path.arcToPoint({
							endPoint: new Offset({ x: endX, y: endY }),
							radius: Radius.circular(radius),
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

		const interpolatedPies = pies.map((pie) => {
			const prev = this.prevAngleMap?.get(pie.name);
			if (prev == null) return pie;
			return {
				...pie,
				startAngle: lerp(prev.startAngle, pie.startAngle, t),
				sweepAngle: lerp(prev.sweepAngle, pie.sweepAngle, t),
			};
		});

		return DataView({ slices: interpolatedPies, dataLabels }, context);
	}
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function toastDataView(
	...[args, context]: Parameters<PieChartCustom<ToastPieChartConfig>["dataView"]>
): Widget {
	if (!context.config.animation.enabled) {
		return DataView(args, context);
	}

	return new AnimatedPieDataView({
		pies: args.slices,
		dataLabels: args.dataLabels,
		context,
		duration: context.config.animation.duration,
	});
}
