import type { Widget } from "flitter-ui";
import type { TreemapCustom } from "flitter-ui/chart";

export function Nodes(
	...[{ tree }]: Parameters<TreemapCustom["nodes"]>
): Widget {
	return tree;
}
