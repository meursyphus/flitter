import { type Widget, Provider, BuildContext } from "flitter-core";
import type { HeatmapConfig } from "./types";

const HEATMAP_CHART_CONTEXT_KEY = Symbol("HeatmapChartKey");

export function HeatmapConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: HeatmapConfig;
}): Widget {
  return Provider({
    child,
    providerKey: HEATMAP_CHART_CONTEXT_KEY,
    value,
  });
}

HeatmapConfigProvider.of = (context: BuildContext): HeatmapConfig => {
  return Provider.of(HEATMAP_CHART_CONTEXT_KEY, context);
};
