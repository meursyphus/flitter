import {
	Alignment,
	BorderRadius,
	BoxDecoration,
	Container,
	Opacity,
	Radius,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";

export function agSegment(
	...[{ color, dataLabel, isHovered, isDimmed }, ctx]: Parameters<
		FunnelChartCustom<FunnelChartConfig>["segment"]
	>
): Widget {
	const segment = Container({
		alignment: Alignment.center,
		decoration: new BoxDecoration({
			color,
			borderRadius: BorderRadius.all(
				Radius.circular(ctx.config.funnel.segmentRadius),
			),
		}),
		child: dataLabel,
	});

	return ZIndex({
		zIndex: isHovered ? 1 : 0,
		child: Opacity({
			opacity: isDimmed ? ctx.config.funnel.dimOpacity : 1,
			child: segment,
		}),
	});
}
