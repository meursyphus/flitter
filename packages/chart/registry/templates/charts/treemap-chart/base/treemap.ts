import type { Widget } from "flitter-core";
import type { TreemapCustom } from "@headless/treemap-chart/types";

export function Treemap(
	...[{ tree }]: Parameters<TreemapCustom["treemap"]>
): Widget {
	return tree;
}
