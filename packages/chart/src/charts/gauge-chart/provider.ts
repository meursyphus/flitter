import { type Widget, Provider, BuildContext } from "flitter-core";
import type { GaugeChartConfig } from "./types";

const GAUGE_CHART_CONTEXT_KEY = Symbol("GaugeChartKey");

export function GaugeChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: GaugeChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: GAUGE_CHART_CONTEXT_KEY,
    value,
  });
}

GaugeChartConfigProvider.of = (context: BuildContext): GaugeChartConfig => {
  return Provider.of(GAUGE_CHART_CONTEXT_KEY, context);
};
