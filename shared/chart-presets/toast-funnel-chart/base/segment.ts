import {
	Alignment,
	BorderRadius,
	BoxDecoration,
	Container,
	Opacity,
	Radius,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";

type SegmentConfig = {
	funnel: {
		segmentRadius: number;
		dimOpacity: number;
	};
};

export function Segment<TConfig extends SegmentConfig>(
	...[{ color, dataLabel, isDimmed }, ctx]: Parameters<
		FunnelChartCustom<TConfig>["segment"]
	>
): Widget {
	return Opacity({
		opacity: isDimmed ? ctx.config.funnel.dimOpacity : 1,
		child: Container({
			alignment: Alignment.center,
			decoration: new BoxDecoration({
				color,
				borderRadius: BorderRadius.all(
					Radius.circular(ctx.config.funnel.segmentRadius),
				),
			}),
			child: dataLabel,
		}),
	});
}
