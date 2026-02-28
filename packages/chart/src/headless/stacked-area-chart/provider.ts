import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { StackedAreaChartController } from "./controller";
import Chart from "./chart";

const STACKED_AREA_CHART_KEY = Symbol("StackedAreaChartKey");

export function StackedAreaChartProvider({
  custom,
  getScale,
  getScaleOptions,
  data,
  title = "",
  config = {},
}: {
  custom: StackedAreaChartCustom<any>;
  title?: string;
  data: StackedAreaChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: STACKED_AREA_CHART_KEY,
    create: () =>
      new StackedAreaChartController({
        data,
        getScale,
        getScaleOptions,
        custom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as StackedAreaChartController;
      controller.data = data;
      controller.custom = custom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

StackedAreaChartProvider.of = (context: BuildContext): StackedAreaChartController => {
  return Provider.of(STACKED_AREA_CHART_KEY, context) as StackedAreaChartController;
};
