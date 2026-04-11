import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type { SankeyChartCustom, SankeyChartData } from "./types";
import { SankeyChartController } from "./controller";
import Chart from "./chart";

const SANKEY_CHART_KEY = Symbol("SankeyChartKey");

export function SankeyChartProvider<TConfig extends object = object>({
  custom,
  data,
  config,
}: {
  custom: SankeyChartCustom<TConfig>;
  data: SankeyChartData;
  config?: TConfig;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: SANKEY_CHART_KEY,
    create: () =>
      new SankeyChartController({
        data,
        custom,
        config: config ?? {},
      }),
    update: (notifier) => {
      const controller = notifier as SankeyChartController;
      controller.update({ data, custom, config: config ?? {} });
    },
    child: new Chart(),
  });
}

SankeyChartProvider.of = (context: BuildContext): SankeyChartController => {
  return Provider.of(SANKEY_CHART_KEY, context) as SankeyChartController;
};
