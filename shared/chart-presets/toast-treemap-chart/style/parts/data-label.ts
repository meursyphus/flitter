import {
	Column,
	CrossAxisAlignment,
	MainAxisAlignment,
	MainAxisSize,
	SizedBox,
	Text,
	TextStyle,
	type Widget,
} from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";
import { formatTreemapValue } from "../../base/format";
import type { TreemapChartConfig } from "../config";

export function toastDataLabel(
	...[{ label, secondaryLabel, value }, ctx]: Parameters<
		TreemapCustom<TreemapChartConfig>["dataLabel"]
	>
): Widget {
	const detail = secondaryLabel ?? formatTreemapValue(value);
	return Column({
		mainAxisSize: MainAxisSize.min,
		mainAxisAlignment: MainAxisAlignment.center,
		crossAxisAlignment: CrossAxisAlignment.center,
		children: [
			Text(label, {
				style: new TextStyle({
					fontFamily: ctx.config.font.family,
					fontSize: 12,
					fontWeight: "600",
					color: ctx.config.treemap.node.labelColor,
				}),
			}),
			SizedBox({ height: 4 }),
			Text(detail, {
				style: new TextStyle({
					fontFamily: ctx.config.font.family,
					fontSize: 11,
					color: ctx.config.treemap.node.secondaryLabelColor,
				}),
			}),
		],
	});
}
