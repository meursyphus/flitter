import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  BarChartCustom,
  BarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { BarChartController } from "./controller";
import Chart from "./chart";

const BAR_CHART_KEY = Symbol("BarChartKey");

export function BarChartProvider({
  custom,
  getScale,
  getScaleOptions,
  data,
  direction = "vertical",
  config = {},
}: {
  custom: BarChartCustom<any>;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: BAR_CHART_KEY,
    create: () =>
      new BarChartController({
        data,
        getScale,
        getScaleOptions,
        direction,
        custom,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as BarChartController;
      controller.data = data;
      controller.direction = direction;
      controller.custom = custom;
      controller.config = config;
    },
    child: new Chart(),
  });
}

BarChartProvider.of = (context: BuildContext): BarChartController => {
  return Provider.of(BAR_CHART_KEY, context) as BarChartController;
};
