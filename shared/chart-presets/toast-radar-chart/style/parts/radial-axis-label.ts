import {
  Border,
  BorderRadius,
  BoxDecoration,
  Container,
  EdgeInsets,
  Radius,
  Text,
  TextStyle,
  type Widget,
  SizedBox,
} from "flitter-core";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { ToastRadarChartConfig } from "../config";

export function toastRadialAxisLabel(
  ...[{ value, index, ratio }, ctx]: Parameters<
    RadarChartCustom<ToastRadarChartConfig>["radialAxisLabel"]
  >
): Widget {
  if (index === 0 || ratio >= 0.9999) return SizedBox.shrink();

  const { font, axis } = ctx.config;

  return Container({
    padding: EdgeInsets.symmetric({ horizontal: 3, vertical: 1 }),
    decoration: new BoxDecoration({
      color: "#f3f4f6",
      borderRadius: BorderRadius.all(Radius.circular(4)),
      border: Border.all({ color: "rgba(0, 0, 0, 0.08)", width: 1 }),
    }),
    child: Text(String(value), {
      style: new TextStyle({
        fontFamily: font.family,
        fontSize: axis.label.fontSize - 1,
        color: axis.label.color,
      }),
    }),
  });
}
