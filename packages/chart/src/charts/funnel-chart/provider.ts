import { type Widget, Provider, BuildContext } from "flitter-core";
import type { FunnelChartConfig } from "./types";

const FUNNEL_CHART_CONTEXT_KEY = Symbol("FunnelChartKey");

export function FunnelChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: FunnelChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: FUNNEL_CHART_CONTEXT_KEY,
    value,
  });
}

FunnelChartConfigProvider.of = (context: BuildContext): FunnelChartConfig => {
  return Provider.of(FUNNEL_CHART_CONTEXT_KEY, context);
};
