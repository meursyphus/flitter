import {
  Alignment,
  Container,
  FractionallySizedBox,
  Stack,
  StackFit,
  type Widget,
} from "flitter-core";
import type { WaterfallChartCustom } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";

export function agBarBox(
  ...[{ bar, geometry, isHovered }]: Parameters<
    WaterfallChartCustom<WaterfallChartConfig>["barBox"]
  >
): Widget {
  return Stack({
    fit: StackFit.expand,
    children: [
      FractionallySizedBox({
        alignment: geometry.boxAlignment,
        heightFactor: geometry.boxHeightFactor,
        child: Container({
          alignment: Alignment.center,
          child: FractionallySizedBox({
            widthFactor: 0.74,
            child: bar,
          }),
        }),
      }),
    ],
  });
}
