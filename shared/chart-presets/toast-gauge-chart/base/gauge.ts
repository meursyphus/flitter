import type { GaugeChartCustom } from "../types";
import {
  Stack,
  Alignment,
  Positioned,
  SizedBox,
} from "flitter-core";

export function Gauge(
  ...[{ needle, scale }]: Parameters<GaugeChartCustom["gauge"]>
) {
  return SizedBox({
    width: 250,
    height: 150,
    child: Stack({
      alignment: Alignment.bottomCenter,
      children: [
        Positioned.fill({ child: scale }),
        Positioned.fill({ child: needle }),
      ],
    }),
  });
}
