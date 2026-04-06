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
import type { PieChartCustom, PieChartSlice } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";
import { DataView } from "../../../base/data-view";

class AnimatedPieEntrance extends StatefulWidget {
	child: Widget;
	duration: number;

	constructor({ child, duration }: { child: Widget; duration: number }) {
		super();
		this.child = child;
		this.duration = duration;
	}

	createState() {
		return new _AnimatedPieEntranceState();
	}
}

class _AnimatedPieEntranceState extends State<AnimatedPieEntrance> {
	controller!: AnimationController;
	tween!: { value: number };

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
		this.controller.forward();
	}

	override dispose() {
		this.controller.dispose();
	}

	override build() {
		const t = this.tween.value;
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
			child: this.widget.child,
		});
	}
}

export function toastDataView(
	...[args, context]: Parameters<PieChartCustom<ToastPieChartConfig>["dataView"]>
): Widget {
	const child = DataView(args, context);

	if (!context.config.animation.enabled) {
		return child;
	}

	return new AnimatedPieEntrance({
		child,
		duration: context.config.animation.duration,
	});
}
