import {
	Alignment,
	Border,
	BoxDecoration,
	BoxShadow,
	Container,
	EdgeInsets,
	LayoutBuilder,
	SizedBox,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { TreemapCustom } from "@headless/treemap-chart/types";
import { resolveTreemapNodeColor } from "../../../base/color";
import type { TreemapChartConfig } from "../config";

export function toastNode(
	...[args, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["node"]>
): Widget {
	const { treemap } = ctx.config;
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
			const color = resolveTreemapNodeColor(args.color, args.groupRatio);

			return ZIndex({
				zIndex: args.isHovered ? 9999 : 0,
				child: Container({
					margin: EdgeInsets.all(treemap.nodeGap / 2),
					decoration: new BoxDecoration({
						color,
						border: args.isHovered
							? Border.all({
									color: treemap.node.hoverBorderColor,
									width: treemap.node.hoverBorderWidth,
									strokeAlign: 1,
							  })
							: undefined,
						boxShadow: args.isHovered
							? [
									new BoxShadow({
										color: treemap.node.hoverShadowColor,
										blurRadius: 8,
									}),
							  ]
							: undefined,
					}),
					alignment: Alignment.center,
					child: showDataLabel ? args.dataLabel : undefined,
				}),
			});
		},
	});
}
