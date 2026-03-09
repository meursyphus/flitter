import {
  Align,
  Alignment,
  Text,
  TextAlign,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { AgRadarChartConfig } from "../config";

export function agAngularAxisLabel(
  ...[{ label, angle, nx, ny }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["angularAxisLabel"]>
): Widget {
  const { font, axis } = ctx.config;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const labelOffset = 0.08;
  const lx = nx + labelOffset * cos;
  const ly = ny + labelOffset * sin;
  const alignX = lx * 2 - 1;
  const alignY = ly * 2 - 1;

  let textAlign = TextAlign.center;
  if (cos > 0.1) {
    textAlign = TextAlign.left;
  } else if (cos < -0.1) {
    textAlign = TextAlign.right;
  }

  return Align({
    alignment: new Alignment({ x: alignX, y: alignY }),
    child: Text(label, {
      textAlign,
      style: new TextStyle({
        fontFamily: font.family,
        fontSize: axis.label.fontSize,
        color: axis.label.color,
      }),
    }),
  });
}
