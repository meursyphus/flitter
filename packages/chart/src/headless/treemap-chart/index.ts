import type { Widget } from "flitter-core";
import type { TreemapCustom, TreemapData } from "./types";
import { TreemapChartProvider } from "./provider";

export default function TreemapChart<TConfig = {}>(props: {
	custom: TreemapCustom<TConfig>;
	data: TreemapData;
	config?: TConfig;
}): Widget {
	return TreemapChartProvider(props as any);
}
