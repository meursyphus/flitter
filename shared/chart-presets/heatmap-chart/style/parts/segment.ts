import {
  BoxDecoration,
  Border,
  BoxShadow,
  Container,
  EdgeInsets,
  Opacity,
  ZIndex,
  type Widget,
} from "flitter-ui";
import type { HeatmapCustom } from "flitter-ui/chart";
import type { AgHeatmapChartConfig } from "../config";

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
  ...[{ value, xIndex, yIndex, isHovered }, ctx]: Parameters<
    HeatmapCustom<AgHeatmapChartConfig>["segment"]
  >
): Widget {
  const { heatmap } = ctx.config;
  const { min, max } = ctx.scale;
  const fraction = max === min ? 0.5 : (value - min) / (max - min);
  const color = interpolateColor(heatmap.colorRange, fraction);
  const { hoveredSegment } = ctx;

  const isActive = isHovered;
  const isDimmed = hoveredSegment != null && !isActive;

  const segment = Container({
    margin: EdgeInsets.all(heatmap.segment.gap),
    decoration: new BoxDecoration({
      color,
      border: isActive
        ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
        : undefined,
      boxShadow: isActive
        ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
        : undefined,
    }),
  });

  return ZIndex({
    zIndex: isActive ? 1 : 0,
    child: isDimmed
      ? Opacity({ opacity: 0.5, child: segment })
      : segment,
  });
}
