import { Text, TextStyle, type Widget } from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";

export function toastStageLabel(
	...[{ label }, ctx]: Parameters<FunnelChartCustom<FunnelChartConfig>["stageLabel"]>
): Widget {
	return Text(label, {
		style: new TextStyle({
			fontFamily: ctx.config.font.family,
			fontSize: 13,
			fontWeight: "600",
			color: "#333333",
		}),
	});
}
