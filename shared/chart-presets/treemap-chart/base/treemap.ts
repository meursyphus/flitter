import type { Widget } from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";

export function Treemap(
	...[{ tree }]: Parameters<TreemapCustom["treemap"]>
): Widget {
	return tree;
}
