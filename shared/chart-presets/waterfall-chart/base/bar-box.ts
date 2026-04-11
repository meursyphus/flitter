import type { WaterfallChartCustom } from "../types";
import {
  Alignment,
  Container,
  FractionallySizedBox,
} from "flitter-ui";

export function BarBox(
  ...[{ bar, geometry }]: Parameters<WaterfallChartCustom["barBox"]>
) {
  return Container({
    width: Infinity,
    height: Infinity,
    child: FractionallySizedBox({
      alignment: geometry.boxAlignment,
      heightFactor: geometry.boxHeightFactor,
      child: Container({
        alignment: Alignment.center,
        child: bar,
      }),
    }),
  });
}
