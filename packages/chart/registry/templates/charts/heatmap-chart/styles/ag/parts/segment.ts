import {
  BoxDecoration,
  Border,
  Container,
  EdgeInsets,
  GestureDetector,
  Offset,
  Opacity,
  type Widget,
} from "flitter-core";
import type { HeatmapCustom } from "@headless/heatmap-chart/types";
import type { AgHeatmapChartConfig } from "../config";
import { agTooltipContent } from "@styles/ag";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";

export function interpolateColor(
  colorRange: [string, string, string],
  t: number,
): string {
  const clamp = Math.max(0, Math.min(1, t));
  const hex = (c: string) => {
    const h = c.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [r0, g0, b0] = hex(colorRange[0]);
  const [r1, g1, b1] = hex(colorRange[1]);
  const [r2, g2, b2] = hex(colorRange[2]);

  let r: number, g: number, b: number;
  if (clamp <= 0.5) {
    const local = clamp * 2;
    r = r0 + (r1 - r0) * local;
    g = g0 + (g1 - g0) * local;
    b = b0 + (b1 - b0) * local;
  } else {
    const local = (clamp - 0.5) * 2;
    r = r1 + (r2 - r1) * local;
    g = g1 + (g2 - g1) * local;
    b = b1 + (b2 - b1) * local;
  }

  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function agSegment(
  ...[{ value, xIndex, yIndex }, ctx]: Parameters<HeatmapCustom<AgHeatmapChartConfig>["segment"]>
): Widget {
  const { heatmap, tooltip } = ctx.config;
  const { min, max } = ctx.scale;
  const fraction = max === min ? 0.5 : (value - min) / (max - min);
  const color = interpolateColor(heatmap.colorRange, fraction);
  const hovered = ctx.hovered?.xIndex === xIndex && ctx.hovered?.yIndex === yIndex;

  const segment = Container({
    margin: EdgeInsets.all(heatmap.segment.gap),
    decoration: new BoxDecoration({
      color,
      border: hovered
        ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
        : undefined,
    }),
  });

  const base = GestureDetector({
    cursor: "default",
    child: hovered ? segment : Opacity({ opacity: 1, child: segment }),
  });

  if (!tooltip.enabled) return base;

  return new HoverTooltip({
    position: "topCenter",
    offset: new Offset({ x: 0, y: -0.1 }),
    tooltip: agTooltipContent({
      label: `${ctx.data.yLabels[yIndex] ?? ""} / ${ctx.data.xLabels[xIndex] ?? ""}`,
      items: { legend: "Value", color, value },
      config: ctx.config as any,
    }),
    renderChild: () => base,
    onMouseEnter: () =>
      ctx.setHovered({
        value,
        xIndex,
        yIndex,
        xLabel: ctx.data.xLabels[xIndex] ?? "",
        yLabel: ctx.data.yLabels[yIndex] ?? "",
      }),
    onMouseLeave: () => ctx.setHovered(null),
    cursor: "default",
  });
}
