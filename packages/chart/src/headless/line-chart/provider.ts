import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
  GetPointValueFn,
} from "./types";
import { LineChartController } from "./controller";
import Chart from "./chart";

const LINE_CHART_KEY = Symbol("LineChartKey");

export function LineChartProvider<TConfig extends object = object>({
  custom,
  getScale,
  getScaleOptions,
  getPointValue,
  data,
  config,
}: {
  custom: LineChartCustom<TConfig>;
  data: LineChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  getPointValue?: GetPointValueFn;
  config?: TConfig;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: LINE_CHART_KEY,
    create: () =>
      new LineChartController({
        data,
        getScale,
        getScaleOptions,
        getPointValue,
        custom,
        config: config ?? {},
      }),
    update: (notifier) => {
      const controller = notifier as LineChartController;
      controller.data = data;
      controller.custom = custom;
      controller.config = config ?? {};
    },
    child: new Chart(),
  });
}

LineChartProvider.of = (context: BuildContext): LineChartController => {
  return Provider.of(LINE_CHART_KEY, context) as LineChartController;
};
