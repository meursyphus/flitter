import {
  Container,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  Radius,
  Border,
  BoxShadow,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";

function barBorderRadius(
  cornerRadius: number,
  direction: "vertical" | "horizontal",
  value: number,
) {
  if (cornerRadius === 0) return undefined;
  const r = Radius.circular(cornerRadius);
  const z = Radius.zero;

  if (direction === "vertical") {
    return value >= 0
      ? BorderRadius.only({ topLeft: r, topRight: r, bottomLeft: z, bottomRight: z })
      : BorderRadius.only({ topLeft: z, topRight: z, bottomLeft: r, bottomRight: r });
  }
  return value >= 0
    ? BorderRadius.only({ topLeft: z, topRight: r, bottomLeft: z, bottomRight: r })
    : BorderRadius.only({ topLeft: r, topRight: z, bottomLeft: r, bottomRight: z });
}

export function toastBar(
  { legend, value, isHovered }: { value: number; label: string; legend: string; index: number; isHovered: boolean },
  context: BarChartContext<ToastBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors[idx % colors.length];
  const borderRadius = barBorderRadius(bar.cornerRadius, context.direction, value);

  const decoration = isHovered
    ? new BoxDecoration({
      color,
      borderRadius,
      border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
      boxShadow: [
        new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
      ],
    })
    : new BoxDecoration({ color, borderRadius });

  return Container({
    margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
    decoration,
  });
}
