import type { Widget } from "flitter-core";
import { BaseTreemapChart } from "./base";
import type {
	GetTreemapLayoutFn,
	GetTreemapLayoutOptionsFn,
	TreemapCustom,
	TreemapData,
	TreemapLegacyData,
} from "./base";
import { styleConfig, type TreemapChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
	GetTreemapLayoutFn,
	GetTreemapLayoutOptionsFn,
	TreemapContext,
	TreemapCustom,
	TreemapData,
	TreemapLegacyData,
	TreemapDataset,
	TreemapResolvedData,
	TreemapResolvedDataset,
	TreemapResolvedNode,
	TreemapHoveredNode,
	TreemapHoveredNodeRect,
	TreemapLayout,
	TreemapLayoutDirection,
	TreemapLayoutItem,
	TreemapLayoutSize,
	TreemapLayoutOptions,
	TreemapNode,
} from "./base";
export { TreemapController, defaultGetTreemapLayout, squarifyTreemapLayout } from "./base";
export { type TreemapChartConfig } from "./style";

export default function TreemapChart({
	data,
	config,
	custom,
	getLayout,
	getLayoutOptions,
}: {
	custom?: Partial<TreemapCustom<TreemapChartConfig>>;
	data: TreemapData | TreemapLegacyData;
	config?: DeepPartial<TreemapChartConfig>;
	getLayout?: GetTreemapLayoutFn;
	getLayoutOptions?: GetTreemapLayoutOptionsFn;
}): Widget {
	return BaseTreemapChart({
		data,
		config: styleConfig.createConfig(config),
		custom: { ...styleConfig.custom, ...custom } as TreemapCustom<TreemapChartConfig>,
		getLayout,
		getLayoutOptions,
	});
}
