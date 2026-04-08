import { BoxDecoration, Container, EdgeInsets, type Widget } from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";

export function toastGroup(
	...[args, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["group"]>
): Widget {
	return Container({
		margin: EdgeInsets.all(ctx.config.treemap.groupGap / 2),
		decoration: new BoxDecoration({
			color: args.color,
		}),
		child: args.nodes,
	});
}
