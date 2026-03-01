import { type Widget, Provider, BuildContext } from "flitter-core";
import type { RadarChartConfig } from "./types";

const RADAR_CHART_CONTEXT_KEY = Symbol("RadarChartKey");

export function RadarChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: RadarChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: RADAR_CHART_CONTEXT_KEY,
    value,
  });
}

RadarChartConfigProvider.of = (context: BuildContext): RadarChartConfig => {
  return Provider.of(RADAR_CHART_CONTEXT_KEY, context);
};
