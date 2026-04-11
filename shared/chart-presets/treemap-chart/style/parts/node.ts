import {
	Alignment,
	BoxDecoration,
	Container,
	EdgeInsets,
	LayoutBuilder,
	Opacity,
	Padding,
	SizedBox,
	ZIndex,
	type Widget,
} from "flitter-ui";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";

export function agNode(
	...[args, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["node"]>
): Widget {
	const { treemap } = ctx.config;
	const isDimmed = ctx.hoveredNode != null && !args.isHovered;
	return LayoutBuilder({
		builder: (_buildCtx, constraints) => {
			const width = constraints.maxWidth;
			const height = constraints.maxHeight;
			if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
				return SizedBox.shrink();
			}

			const showDataLabel =
				width >= treemap.node.minLabelWidth &&
				height >= treemap.node.minLabelHeight;
			const color = args.color;

			const tile = Container({
				decoration: new BoxDecoration({
					color,
				}),
				alignment: Alignment.center,
				child: showDataLabel ? args.dataLabel : undefined,
			});

			return ZIndex({
				zIndex: args.isHovered ? 1 : 0,
				child: isDimmed
					? Opacity({
							opacity: treemap.node.dimOpacity,
							child: Padding({
								padding: EdgeInsets.all(treemap.nodeGap / 2),
								child: tile,
							}),
					  })
					: Padding({
							padding: EdgeInsets.all(treemap.nodeGap / 2),
							child: tile,
					  }),
			});
		},
	});
}
