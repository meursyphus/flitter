import type { Widget } from "flitter-ui";
import type { TreemapCustom } from "flitter-ui/chart";

export function Treemap(
	...[{ tree }]: Parameters<TreemapCustom["treemap"]>
): Widget {
	return tree;
}
