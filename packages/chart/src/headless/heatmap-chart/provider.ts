import { type Widget, Provider, BuildContext } from "flitter-core";
import type { HeatmapContext } from "./types";

const HEATMAP_CONTEXT_KEY = Symbol("HeatmapContextKey");

export function HeatmapContextProvider({
  child,
  value,
}: {
  child: Widget;
  value: HeatmapContext;
}): Widget {
  return Provider({
    child,
    providerKey: HEATMAP_CONTEXT_KEY,
    value,
  });
}

HeatmapContextProvider.of = (context: BuildContext): HeatmapContext => {
  return Provider.of(HEATMAP_CONTEXT_KEY, context);
};
