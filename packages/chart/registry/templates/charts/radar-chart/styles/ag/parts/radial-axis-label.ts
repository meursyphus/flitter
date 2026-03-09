import {
  SizedBox,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { AgRadarChartConfig } from "../config";

export function agRadialAxisLabel(
  ...[{ value, index }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["radialAxisLabel"]>
): Widget {
  if (index === 0) return SizedBox.shrink();

  const { font, axis } = ctx.config;

  return Text(String(value), {
    style: new TextStyle({
      fontFamily: font.family,
      fontSize: axis.label.fontSize - 1,
      color: axis.label.color,
    }),
  });
}
