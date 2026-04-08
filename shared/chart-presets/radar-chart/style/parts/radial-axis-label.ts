import {
  Container,
  EdgeInsets,
  SizedBox,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { AgRadarChartConfig } from "../config";

export function agRadialAxisLabel(
  ...[{ value, index, ratio }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["radialAxisLabel"]>
): Widget {
  if (index === 0) return SizedBox.shrink();

  const { font, axis } = ctx.config;

  return Container({
    margin: EdgeInsets.only({ right: 4 }),
    child: Text(String(value), {
      style: new TextStyle({
        fontFamily: font.family,
        fontSize: axis.label.fontSize - 1,
        color: axis.label.color,
      }),
    }),
  });
}
