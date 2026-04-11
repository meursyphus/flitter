import type { Widget } from "flitter-core";
import type {
	GetTreemapLayoutFn,
	GetTreemapLayoutOptionsFn,
	TreemapCustom,
	TreemapData,
	TreemapLegacyData,
} from "./types";
import { TreemapChartProvider } from "./provider";

export default function TreemapChart<TConfig extends object = object>(props: {
	custom: TreemapCustom<TConfig>;
	data: TreemapData | TreemapLegacyData;
	config?: TConfig;
	getLayout?: GetTreemapLayoutFn;
	getLayoutOptions?: GetTreemapLayoutOptionsFn;
}): Widget {
	return TreemapChartProvider(props);
}
