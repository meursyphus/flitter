import type { Widget } from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";

export function Nodes(
	...[{ tree }]: Parameters<TreemapCustom["nodes"]>
): Widget {
	return tree;
}
