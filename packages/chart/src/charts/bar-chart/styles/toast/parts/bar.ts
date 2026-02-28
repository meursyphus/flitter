import {
  Container,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  Radius,
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
  { legend, value }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  return Container({
    margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
    decoration: new BoxDecoration({
      color: colors[idx % colors.length],
      borderRadius: barBorderRadius(bar.cornerRadius, context.direction, value),
    }),
  });
}
