import {
  type Widget,
  Provider,
  BuildContext,
  ChangeNotifierProvider,
} from "flitter-core";
import type {
  BulletChartCustom,
  BulletChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { BulletChartController } from "./controller";
import Chart from "./chart";

const BULLET_CHART_KEY = Symbol("BulletChartKey");

export function BulletChartProvider({
  custom,
  getScale,
  getScaleOptions,
  data,
  config = {},
}: {
  custom: BulletChartCustom<any>;
  data: BulletChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: any;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: BULLET_CHART_KEY,
    create: () =>
      new BulletChartController({
        data,
        getScale,
        getScaleOptions,
        custom,
        config,
      }),
    update: (notifier) => {
      const controller = notifier as BulletChartController;
      controller.data = data;
      controller.custom = custom;
      controller.config = config;
    },
    child: new Chart(),
  });
}

BulletChartProvider.of = (context: BuildContext): BulletChartController => {
  return Provider.of(BULLET_CHART_KEY, context) as BulletChartController;
};
