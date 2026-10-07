import {
  ChangeNotifierProvider,
  Provider,
  type BuildContext,
  type Widget,
} from "flitter-core";
import { FunnelChartController } from "./controller";
import type { FunnelChartCustom, FunnelChartData } from "./types";
import Chart from "./chart";

const FUNNEL_CHART_KEY = Symbol("FunnelChart");

export function FunnelChartProvider<TConfig extends object>({
  data,
  custom,
  config,
}: {
  data: FunnelChartData;
  custom: FunnelChartCustom<TConfig>;
  config: TConfig;
}): Widget {
  return ChangeNotifierProvider({
    providerKey: FUNNEL_CHART_KEY,
    create: () => new FunnelChartController({ data, custom, config }),
    update: (notifier) =>
      (notifier as FunnelChartController<TConfig>).update({
        data,
        custom,
        config,
      }),
    child: new Chart(),
  });
}

FunnelChartProvider.of = (context: BuildContext): FunnelChartController<any> =>
  Provider.of(FUNNEL_CHART_KEY, context) as FunnelChartController<any>;
