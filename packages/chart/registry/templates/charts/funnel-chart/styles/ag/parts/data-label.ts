import { Text, TextStyle, type Widget } from "flitter-core";
import type { FunnelChartCustom } from "@headless/funnel-chart/types";
import type { FunnelChartConfig } from "../config";

export function agDataLabel(
	...[{ value }, ctx]: Parameters<FunnelChartCustom<FunnelChartConfig>["dataLabel"]>
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
