import {
  Text,
  TextAlign,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { AgRadarChartConfig } from "../config";

export function agAngularAxisLabel(
  ...[{ label, angle }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["angularAxisLabel"]>
): Widget {
  const { font, axis } = ctx.config;
  const cos = Math.cos(angle);

  let textAlign = TextAlign.center;
  if (cos > 0.1) {
    textAlign = TextAlign.left;
  } else if (cos < -0.1) {
    textAlign = TextAlign.right;
  }

  return Text(label, {
    textAlign,
    style: new TextStyle({
      fontFamily: font.family,
      fontSize: axis.label.fontSize,
      color: axis.label.color,
    }),
  });
}
