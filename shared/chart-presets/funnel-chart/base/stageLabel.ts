import type { FunnelChartCustom } from "../types";
import { Text, TextStyle, type Widget } from "flitter-core";

export function StageLabel<TConfig extends { font: { family: string } }>(
	...[{ label }, ctx]: Parameters<FunnelChartCustom<TConfig>["stageLabel"]>
): Widget {
	return Text(label, {
		style: new TextStyle({
			fontFamily: ctx.config.font.family,
			fontSize: 12,
			fontWeight: "600",
			color: "#334155",
		}),
	});
}
