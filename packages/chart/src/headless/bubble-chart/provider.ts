import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  BubbleChartCustom,
  BubbleChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { BubbleChartController } from "./controller";
import Chart from "./chart";

const BUBBLE_CHART_KEY = Symbol("BubbleChartKey");

export function BubbleChartProvider({
  custom,
  getScale,
  getScaleOptions,
  data,
  config = {},
}: {
  custom: BubbleChartCustom<any>;
  data: BubbleChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: BUBBLE_CHART_KEY,
    create: () =>
      new BubbleChartController({
        data,
        getScale,
        getScaleOptions,
        custom,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as BubbleChartController;
      controller.data = data;
      controller.custom = custom;
      controller.config = config;
    },
    child: new Chart(),
  });
}

BubbleChartProvider.of = (context: BuildContext): BubbleChartController => {
  return Provider.of(BUBBLE_CHART_KEY, context) as BubbleChartController;
};
