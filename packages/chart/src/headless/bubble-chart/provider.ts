import { Provider, BuildContext, Widget } from "flitter-core";
import { BubbleChartConfig } from "./types";

const BUBBLE_CHART_CONTEXT_KEY = Symbol("BubbleChartKey");

export function BubbleChartConfigProvider({
  child,
  value,
}: {
  child: Widget;
  value: BubbleChartConfig;
}): Widget {
  return Provider({
    child,
    providerKey: BUBBLE_CHART_CONTEXT_KEY,
    value,
  });
}

BubbleChartConfigProvider.of = (context: BuildContext): BubbleChartConfig => {
  return Provider.of(BUBBLE_CHART_CONTEXT_KEY, context);
};
