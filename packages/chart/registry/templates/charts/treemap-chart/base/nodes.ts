import type { Widget } from "flitterjs";
import type { TreemapCustom } from "@headless/treemap-chart/types";

export function Nodes(
	...[{ tree }]: Parameters<TreemapCustom["nodes"]>
): Widget {
	return tree;
}
