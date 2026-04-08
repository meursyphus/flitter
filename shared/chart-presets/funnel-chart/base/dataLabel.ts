import type { FunnelChartCustom } from "../types";
import { Text, TextStyle, type Widget } from "flitter-core";

export function DataLabel<TConfig extends { font: { family: string } }>(
	...[{ value }, ctx]: Parameters<FunnelChartCustom<TConfig>["dataLabel"]>
): Widget {
	return Text(value.toLocaleString(), {
		style: new TextStyle({
			fontFamily: ctx.config.font.family,
			fontSize: 12,
			fontWeight: "600",
			color: "white",
		}),
	});
}
