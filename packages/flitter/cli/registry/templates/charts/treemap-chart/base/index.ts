import { SizedBox, type Widget } from "flitter-core";
import HeadlessTreemapChart from "@headless/treemap-chart";
import { defaultGetTreemapLayout } from "@headless/treemap-chart/layout";
import type {
	GetTreemapLayoutFn,
	GetTreemapLayoutOptionsFn,
	TreemapCustom,
	TreemapData,
	TreemapLegacyData,
} from "@headless/treemap-chart/types";
import { Layout } from "./layout";
import { Plot } from "./plot";
import { Treemap } from "./treemap";
import { Nodes } from "./nodes";

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
} from "@headless/treemap-chart/types";
export { TreemapController } from "@headless/treemap-chart/controller";
export { defaultGetTreemapLayout, squarifyTreemapLayout } from "@headless/treemap-chart/layout";

const baseDefaults: Partial<TreemapCustom> = {
	layout: Layout,
	plot: Plot,
	treemap: Treemap,
	nodes: Nodes,
	groupTitle: () => SizedBox.shrink(),
	dataLabel: () => SizedBox.shrink(),
	tooltip: () => SizedBox.shrink(),
	tooltipArea: () => SizedBox.shrink(),
};

export function BaseTreemapChart<TConfig extends object = object>({
	custom,
	getLayout = defaultGetTreemapLayout,
	...rest
}: {
	custom: Partial<TreemapCustom<TConfig>>;
	data: TreemapData | TreemapLegacyData;
	config?: TConfig;
	getLayout?: GetTreemapLayoutFn;
	getLayoutOptions?: GetTreemapLayoutOptionsFn;
}): Widget {
	return HeadlessTreemapChart({
		...rest,
		getLayout,
		custom: { ...baseDefaults, ...custom } as TreemapCustom<TConfig>,
	});
}
