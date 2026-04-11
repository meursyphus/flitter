"use client";

export const galleryTitle = "Monthly Financial Breakdown";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart } from "shared/chart";
import {
  Container,
  EdgeInsets,
  Stack,
  Alignment,
  CustomPaint,
  Size,
  Path,
  Rect,
  Offset,
  Text,
  TextStyle,
  ZIndex,
  Row,
  SizedBox,
  MainAxisSize,
  Padding,
  BoxDecoration,
  Opacity,
  type Widget as FlitterWidget,
} from "flitter-core";
import type { BarChartContext } from "flitter-ui/chart";

const backgroundColors = ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb"];
const patternColors = ["#c49c81", "#d4573f", "#c9bd3e", "#c08a25", "#38bcb2"];

type LegendPatternType = "dots" | "stripes" | "crosshatch" | "diagonal-stripes" | "grid";
const legendPatterns: LegendPatternType[] = ["dots", "stripes", "crosshatch", "diagonal-stripes", "grid"];

function drawDotsPattern(path: Path, width: number, height: number) {
  for (let y = 4; y < height; y += 10) {
    for (let x = 4 + ((y % 20) / 2); x < width; x += 10) {
      path.addOval(Rect.fromCircle({ center: new Offset({ x, y }), radius: 2.5 }));
    }
  }
}

function drawStripesPattern(path: Path, width: number, height: number) {
  const max = Math.max(width, height);
  for (let y = -max; y < max; y += 12) {
    path.moveTo({ x: width, y });
    path.lineTo({ x: 0, y: y + width });
  }
}

function drawCrosshatchPattern(path: Path, width: number, height: number) {
  const max = Math.max(width, height);
  for (let y = -max; y < max; y += 14) {
    path.moveTo({ x: 0, y });
    path.lineTo({ x: width, y: y + width });
    path.moveTo({ x: width, y });
    path.lineTo({ x: 0, y: y + width });
  }
}

function drawDiagonalStripesPattern(path: Path, width: number, height: number) {
  const max = Math.max(width, height);
  for (let y = -max; y < max; y += 10) {
    path.moveTo({ x: 0, y });
    path.lineTo({ x: width, y: y + width });
  }
}

function drawGridPattern(path: Path, width: number, height: number) {
  for (let x = 0; x < width; x += 12) {
    path.moveTo({ x, y: 0 });
    path.lineTo({ x, y: height });
  }
  for (let y = 0; y < height; y += 12) {
    path.moveTo({ x: 0, y });
    path.lineTo({ x: width, y });
  }
}

function PatternBar(
  { legend, value, label, index, isHovered }: { value: number; label: string; legend: string; index: number; isHovered: boolean },
  context: BarChartContext,
): FlitterWidget {
  const idx = context.legends.indexOf(legend);
  const bgColor = backgroundColors[idx % backgroundColors.length];
  const patternColor = patternColors[idx % patternColors.length];
  const patternType = legendPatterns[idx % legendPatterns.length];

  return ZIndex({
    zIndex: isHovered ? 1 : 0,
    child: Container({
      width: Infinity,
      height: Infinity,
      margin: EdgeInsets.symmetric({ horizontal: 0 }),
      color: bgColor,
      child: Stack({
        alignment: Alignment.center,
        clipped: true,
        children: [
          CustomPaint({
            size: Size.maximum(),
            painter: {
              svg: {
                createDefaultSvgEl(svgContext: any) {
                  return { bar: svgContext.createSvgEl("path") };
                },
                paint({ bar }: any, size: any) {
                  const path = new Path();
                  const { width, height } = size;

                  if (patternType === "dots") {
                    bar.setAttribute("fill", patternColor);
                    drawDotsPattern(path, width, height);
                  } else if (patternType === "stripes") {
                    bar.setAttribute("stroke", patternColor);
                    bar.setAttribute("stroke-width", "4");
                    bar.setAttribute("fill", "none");
                    drawStripesPattern(path, width, height);
                  } else if (patternType === "crosshatch") {
                    bar.setAttribute("stroke", patternColor);
                    bar.setAttribute("stroke-width", "2");
                    bar.setAttribute("fill", "none");
                    drawCrosshatchPattern(path, width, height);
                  } else if (patternType === "diagonal-stripes") {
                    bar.setAttribute("stroke", patternColor);
                    bar.setAttribute("stroke-width", "3");
                    bar.setAttribute("fill", "none");
                    drawDiagonalStripesPattern(path, width, height);
                  } else if (patternType === "grid") {
                    bar.setAttribute("stroke", patternColor);
                    bar.setAttribute("stroke-width", "1.5");
                    bar.setAttribute("fill", "none");
                    drawGridPattern(path, width, height);
                  }
                  bar.setAttribute("d", path.getD());
                },
              },
              canvas: {
                paint(context: any, size: any) {
                  const { width, height } = size;
                  const ctx = context as CanvasRenderingContext2D;

                  if (patternType === "dots") {
                    ctx.fillStyle = patternColor;
                    for (let y = 4; y < height; y += 10) {
                      for (let x = 4 + ((y % 20) / 2); x < width; x += 10) {
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                      }
                    }
                  } else if (patternType === "stripes") {
                    ctx.strokeStyle = patternColor;
                    ctx.lineWidth = 4;
                    const max = Math.max(width, height);
                    for (let y = -max; y < max; y += 12) {
                      ctx.beginPath();
                      ctx.moveTo(width, y);
                      ctx.lineTo(0, y + width);
                      ctx.stroke();
                    }
                  } else if (patternType === "crosshatch") {
                    ctx.strokeStyle = patternColor;
                    ctx.lineWidth = 2;
                    const max = Math.max(width, height);
                    for (let y = -max; y < max; y += 14) {
                      ctx.beginPath();
                      ctx.moveTo(0, y);
                      ctx.lineTo(width, y + width);
                      ctx.stroke();
                      ctx.beginPath();
                      ctx.moveTo(width, y);
                      ctx.lineTo(0, y + width);
                      ctx.stroke();
                    }
                  } else if (patternType === "diagonal-stripes") {
                    ctx.strokeStyle = patternColor;
                    ctx.lineWidth = 3;
                    const max = Math.max(width, height);
                    for (let y = -max; y < max; y += 10) {
                      ctx.beginPath();
                      ctx.moveTo(0, y);
                      ctx.lineTo(width, y + width);
                      ctx.stroke();
                    }
                  } else if (patternType === "grid") {
                    ctx.strokeStyle = patternColor;
                    ctx.lineWidth = 1.5;
                    for (let x = 0; x < width; x += 12) {
                      ctx.beginPath();
                      ctx.moveTo(x, 0);
                      ctx.lineTo(x, height);
                      ctx.stroke();
                    }
                    for (let y = 0; y < height; y += 12) {
                      ctx.beginPath();
                      ctx.moveTo(0, y);
                      ctx.lineTo(width, y);
                      ctx.stroke();
                    }
                  }
                },
              },
            },
          }),
          Text(value > 1500 ? `${value}` : "", {
            style: new TextStyle({ fontSize: 11, color: "#555555", fontWeight: "bold" }),
          }),
        ],
      }),
    }),
  });
}

function PatternLegend(
  { name, index, isVisible }: { name: string; index: number; isVisible?: boolean },
  context: { config: any; isSeriesVisible?(legend: string): boolean },
): FlitterWidget {
  const bgColor = backgroundColors[index % backgroundColors.length];
  const visible = isVisible ?? context.isSeriesVisible?.(name) ?? true;

  const markerSize = 28;

  const marker = Container({
    width: markerSize,
    height: markerSize,
    color: bgColor,
  });

  const content = Padding({
    padding: EdgeInsets.symmetric({ horizontal: 8 }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        marker,
        SizedBox({ width: 6 }),
        Text(name, {
          style: new TextStyle({
            fontSize: 12,
            color: "#333333",
          }),
        }),
      ],
    }),
  });

  return visible
    ? content
    : Opacity({
        opacity: 0.4,
        child: content,
      });
}

export function createWidget() {
  return ToastStackedBarChart({
    data: {
      labels: ["June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { legend: "Budget", values: [5000, 3000, 5000, 7000, 6000, 4000, 1000] },
        { legend: "Income", values: [8000, 4000, 7000, 2000, 6000, 3000, 5000] },
        { legend: "Expenses", values: [4000, 3000, 5000, 4000, 3000, 4000, 3000] },
        { legend: "Debt", values: [6000, 3000, 3000, 2000, 5000, 4000, 2000] },
      ],
    },
    custom: {
      bar: PatternBar,
      legend: PatternLegend,
    },
    config: {
      title: { text: "Monthly Financial Breakdown", visible: true },
      legend: {
        visible: true,
        position: "right-bottom",
      },
      bar: {
        gap: 0,
      },
    },
  });
}

export default function StackedBarChartToastNivoPattern() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
