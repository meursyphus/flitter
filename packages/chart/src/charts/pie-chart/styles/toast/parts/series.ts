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
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";
import { Series } from "../../../base/series";

class AnimatedPieSeries extends StatefulWidget {
	child: Widget;
	duration: number;

	constructor({ child, duration }: { child: Widget; duration: number }) {
		super();
		this.child = child;
		this.duration = duration;
	}

	createState() {
		return new _AnimatedPieSeriesState();
	}
}

class _AnimatedPieSeriesState extends State<AnimatedPieSeries> {
	animationController!: AnimationController;
	tweenAnimation!: { value: number };

	override initState() {
		this.animationController = new AnimationController({
			duration: this.widget.duration,
		});
		this.animationController.addListener(() => this.setState());
		const tween = new Tween({ begin: 0, end: 1 });
		this.tweenAnimation = tween.animated(
			new CurvedAnimation({
				parent: this.animationController,
				curve: Curves.easeInOut,
			}),
		);
		this.animationController.forward();
	}

	override dispose() {
		this.animationController.dispose();
	}

	override build() {
		const { child } = this.widget;
		const t = this.tweenAnimation.value;
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
}

export function toastSeries(
	...[args, context]: Parameters<PieChartCustom<ToastPieChartConfig>["series"]>
): Widget {
	const child = Series(args, context);

	if (!context.config.animation.enabled) {
		return child;
	}

	return new AnimatedPieSeries({
		child,
		duration: context.config.animation.duration,
	});
}
