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
} from "./types";
import { LineChartController } from "./controller";
import Chart from "./chart";

const LINE_CHART_KEY = Symbol("LineChartKey");

export function LineChartProvider({
  custom,
  getScale,
  getScaleOptions,
  data,
  title = "",
  config = {},
}: {
  custom: LineChartCustom<any>;
  title?: string;
  data: LineChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: LINE_CHART_KEY,
    create: () =>
      new LineChartController({
        data,
        getScale,
        getScaleOptions,
        custom,
        title,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as LineChartController;
      controller.data = data;
      controller.custom = custom;
      controller.title = title;
      controller.config = config;
    },
    child: new Chart(),
  });
}

LineChartProvider.of = (context: BuildContext): LineChartController => {
  return Provider.of(LINE_CHART_KEY, context) as LineChartController;
};
