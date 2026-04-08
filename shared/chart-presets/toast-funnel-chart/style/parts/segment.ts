import {
	Alignment,
	AnimatedScale,
	Border,
	BorderRadius,
	BoxDecoration,
	BoxShadow,
	Container,
	Opacity,
	Radius,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";

export function toastSegment(
	...[{ color, dataLabel, isHovered }, ctx]: Parameters<
		FunnelChartCustom<FunnelChartConfig>["segment"]
	>
): Widget {
	const segment = AnimatedScale({
		duration: ctx.config.animation.duration,
		scale: isHovered ? 1.03 : 1,
		alignment: Alignment.center,
		child: Container({
			alignment: Alignment.center,
			decoration: new BoxDecoration({
				color,
				borderRadius: BorderRadius.all(
					Radius.circular(ctx.config.funnel.segmentRadius),
				),
				border: isHovered
					? Border.all({ color: "white", width: 3, strokeAlign: 1 })
					: undefined,
				boxShadow: isHovered
					? [new BoxShadow({ color: "rgba(0,0,0,0.24)", blurRadius: 16 })]
					: undefined,
			}),
			child: dataLabel,
		}),
	});

	return ZIndex({
		zIndex: isHovered ? 1 : 0,
		child: Opacity({
			opacity: 1,
			child: segment,
		}),
	});
}
