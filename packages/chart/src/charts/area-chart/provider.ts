import { type Widget, Provider, BuildContext } from "flitter-core";
import type { AreaChartConfig } from "./types";

const AREA_CHART_CONTEXT_KEY = Symbol("BarChartKey");

export function AreaChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: AreaChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: AREA_CHART_CONTEXT_KEY,
    value,
  });
}

AreaChartConfigProvider.of = (context: BuildContext): AreaChartConfig => {
  return Provider.of(AREA_CHART_CONTEXT_KEY, context);
};
