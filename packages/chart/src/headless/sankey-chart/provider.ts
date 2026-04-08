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

export function SankeyChartProvider({
  custom,
  data,
  config = {},
}: {
  custom: SankeyChartCustom<any>;
  data: SankeyChartData;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: SANKEY_CHART_KEY,
    create: () =>
      new SankeyChartController({
        data,
        custom,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as SankeyChartController;
      controller.update({ data, custom, config });
    },
    child: new Chart(),
  });
}

SankeyChartProvider.of = (context: BuildContext): SankeyChartController => {
  return Provider.of(SANKEY_CHART_KEY, context) as SankeyChartController;
};
