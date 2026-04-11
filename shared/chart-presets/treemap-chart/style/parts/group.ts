import {
	Column,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	Expanded,
	Padding,
	SizedBox,
	type Widget,
} from "flitter-ui";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";

export function agGroup(
	...[args, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["group"]>
): Widget {
	const { treemap } = ctx.config;
	const titleVisible = treemap.groupTitle.visible && args.legend.length > 0;

	return Padding({
		padding: EdgeInsets.all(treemap.groupGap / 2),
		child: Column({
			crossAxisAlignment: CrossAxisAlignment.stretch,
			children: titleVisible
				? [
						Container({
							padding: EdgeInsets.symmetric({
								horizontal: treemap.groupTitle.padding.horizontal,
								vertical: treemap.groupTitle.padding.vertical,
							}),
							child: args.title,
						}),
						SizedBox({ height: treemap.groupTitle.gap }),
						Expanded({ child: args.nodes }),
				  ]
				: [Expanded({ child: args.nodes })],
		}),
	});
}
