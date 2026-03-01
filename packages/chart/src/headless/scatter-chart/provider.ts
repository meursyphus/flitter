import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  ScatterChartCustom,
  ScatterChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { ScatterChartController } from "./controller";
import Chart from "./chart";

const SCATTER_CHART_KEY = Symbol("ScatterChartKey");

export function ScatterChartProvider({
  custom,
  getScale,
  getScaleOptions,
  data,
  config = {},
}: {
  custom: ScatterChartCustom<any>;
  data: ScatterChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: SCATTER_CHART_KEY,
    create: () =>
      new ScatterChartController({
        data,
        getScale,
        getScaleOptions,
        custom,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as ScatterChartController;
      controller.data = data;
      controller.custom = custom;
      controller.config = config;
    },
    child: new Chart(),
  });
}

ScatterChartProvider.of = (context: BuildContext): ScatterChartController => {
  return Provider.of(SCATTER_CHART_KEY, context) as ScatterChartController;
};
