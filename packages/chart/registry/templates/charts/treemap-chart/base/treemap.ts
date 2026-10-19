import type { Widget } from "flitterjs";
import type { TreemapCustom } from "@headless/treemap-chart/types";

export function Treemap(
	...[{ tree }]: Parameters<TreemapCustom["treemap"]>
): Widget {
	return tree;
}
