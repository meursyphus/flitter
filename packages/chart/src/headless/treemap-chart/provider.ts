import { type Widget, Provider, BuildContext } from "flitter-core";
import type { TreemapConfig } from "./types";

const TREEMAP_CHART_CONTEXT_KEY = Symbol("TreemapChartKey");

export function TreemapConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: TreemapConfig;
}): Widget {
  return Provider({
    child,
    providerKey: TREEMAP_CHART_CONTEXT_KEY,
    value,
  });
}

TreemapConfigProvider.of = (context: BuildContext): TreemapConfig => {
  return Provider.of(TREEMAP_CHART_CONTEXT_KEY, context);
};
