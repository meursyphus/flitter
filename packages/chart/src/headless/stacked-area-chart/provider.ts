import { type Widget, Provider, BuildContext } from "flitter-core";
import type { StackedAreaChartConfig } from "./types";

const STACKED_AREA_CHART_CONTEXT_KEY = Symbol("StackedAreaChartKey");

export function StackedAreaChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: StackedAreaChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: STACKED_AREA_CHART_CONTEXT_KEY,
    value,
  });
}

StackedAreaChartConfigProvider.of = (
  context: BuildContext,
): StackedAreaChartConfig => {
  return Provider.of(STACKED_AREA_CHART_CONTEXT_KEY, context);
};
