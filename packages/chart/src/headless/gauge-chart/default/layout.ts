import type { GaugeChartCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  MainAxisSize,
} from "flitter-core";

export function Layout(
  ...[{ title, gauge, valueLabel }]: Parameters<GaugeChartCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.all(20),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [title, gauge, valueLabel],
    }),
  });
}
