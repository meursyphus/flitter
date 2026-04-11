"use client";

export const galleryTitle = "Quarterly Profit / Loss by Division";

import Widget from "@flitterjs/react";
import { ToastBarChart } from "shared/chart";
import {
  Container,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  Radius,
  Border,
  ZIndex,
  type Widget as FlitterWidget,
} from "flitter-core";
import type { BarChartContext } from "flitter-ui/chart";

const pillColors = ["#ef4444", "#10b981"];

function pillBar(
  { legend, value, isHovered }: { value: number; label: string; legend: string; index: number; isHovered: boolean },
  context: BarChartContext,
): FlitterWidget {
  const idx = context.legends.indexOf(legend);
  const baseColor = pillColors[idx % pillColors.length];
  const fillColor = baseColor + "44";
  const borderRadius = BorderRadius.all(Radius.circular(10));

  const decoration = isHovered
    ? new BoxDecoration({
        color: baseColor + "66",
        borderRadius,
        border: Border.all({ color: baseColor, width: 2 }),
      })
    : new BoxDecoration({
        color: fillColor,
        borderRadius,
        border: Border.all({ color: baseColor, width: 1.5 }),
      });

  return ZIndex({
    zIndex: isHovered ? 1 : 0,
    child: Container({
      margin: EdgeInsets.symmetric({ horizontal: 1 }),
      decoration,
    }),
  });
}

export function createWidget() {
  return ToastBarChart({
    direction: "horizontal",
    data: {
      labels: ["Cloud", "Hardware", "Consulting", "Retail", "Media", "Logistics", "R&D", "Finance"],
      datasets: [
        { legend: "Loss", values: [-42, -18, -7, -3, -31, -12, -55, -8] },
        { legend: "Profit", values: [15, 6, 22, 26, 9, 38, 11, 64] },
      ],
    },
    custom: {
      bar: pillBar,
    },
    config: {
      colors: pillColors,
      title: { text: "Quarterly Profit / Loss by Division", visible: true },
      legend: { visible: true },
      bar: { cornerRadius: 10, gap: 1 },
    },
  });
}

export default function BarChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
