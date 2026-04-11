import { Text, TextStyle, type Widget } from "flitter-ui";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";

export function agGroupTitle(
	...[{ legend }, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["groupTitle"]>
): Widget {
	const { font, treemap } = ctx.config;
	if (!treemap.groupTitle.visible) {
		return Text("", { style: new TextStyle({ fontSize: 0 }) });
	}

	return Text(legend, {
		style: new TextStyle({
			fontFamily: font.family,
			fontSize: treemap.groupTitle.fontSize,
			fontWeight: "600",
			color: treemap.groupTitle.color,
		}),
	});
}
