import {
	Column,
	CrossAxisAlignment,
	MainAxisSize,
	SizedBox,
	Text,
	TextStyle,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";

export function toastDataLabel(
	...[{ value, percentage, stepPercentage }, ctx]: Parameters<
		FunnelChartCustom<FunnelChartConfig>["dataLabel"]
	>
): Widget {
	const retained = stepPercentage ?? percentage;
	return Column({
		mainAxisSize: MainAxisSize.min,
		crossAxisAlignment: CrossAxisAlignment.center,
		children: [
			Text(value.toLocaleString(), {
				style: new TextStyle({
					fontFamily: ctx.config.font.family,
					fontSize: 14,
					fontWeight: "bold",
					color: "white",
				}),
			}),
			SizedBox({ height: 2 }),
			Text(`${retained.toFixed(0)}% retained`, {
				style: new TextStyle({
					fontFamily: ctx.config.font.family,
					fontSize: 11,
					color: "rgba(255,255,255,0.92)",
				}),
			}),
		],
	});
}
