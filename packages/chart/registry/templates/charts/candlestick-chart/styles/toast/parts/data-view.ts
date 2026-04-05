import { type Widget } from "flitter-core";
import type { CandlestickChartCustom } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "../config";
import { DataView } from "../../../base/data-view";
import { AnimatedDataView } from "@styles/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[args, context]: Parameters<CandlestickChartCustom<CandlestickChartConfig>["dataView"]>
): Widget {
  return new AnimatedDataView({
    child: DataView(args, context),
    duration: context.config.animation.duration,
    isVertical: true,
    baselineRatio: 0,
  });
}
