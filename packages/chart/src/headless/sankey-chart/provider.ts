import { type Widget, Provider, BuildContext } from "flitter-core";
import type { SankeyChartConfig } from "./types";

const SANKEY_CHART_CONTEXT_KEY = Symbol("SankeyChartKey");

export function SankeyChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: SankeyChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: SANKEY_CHART_CONTEXT_KEY,
    value,
  });
}

SankeyChartConfigProvider.of = (context: BuildContext): SankeyChartConfig => {
  return Provider.of(SANKEY_CHART_CONTEXT_KEY, context);
};
