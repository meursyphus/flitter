import type { Widget } from "flitterjs";
import type { TreemapCustom } from "@flitterjs/chart";

export function Nodes(
	...[{ tree }]: Parameters<TreemapCustom["nodes"]>
): Widget {
	return tree;
}
