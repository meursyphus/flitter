import type { Widget } from "flitterjs";
import type { TreemapCustom } from "@flitterjs/chart";

export function Treemap(
	...[{ tree }]: Parameters<TreemapCustom["treemap"]>
): Widget {
	return tree;
}
