import type { Widget } from "flitter-core";
import type { TreemapCustom } from "@headless/treemap-chart/types";

export function Nodes(
	...[{ tree }]: Parameters<TreemapCustom["nodes"]>
): Widget {
	return tree;
}
