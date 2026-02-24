import { type Widget, Provider, BuildContext } from "flitter-core";
import type { SunburstConfig } from "./types";

const SUNBURST_CHART_CONTEXT_KEY = Symbol("SunburstChartKey");

export function SunburstConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: SunburstConfig;
}): Widget {
  return Provider({
    child,
    providerKey: SUNBURST_CHART_CONTEXT_KEY,
    value,
  });
}

SunburstConfigProvider.of = (context: BuildContext): SunburstConfig => {
  return Provider.of(SUNBURST_CHART_CONTEXT_KEY, context);
};
