import {
  Column,
  CrossAxisAlignment,
  CustomPaint,
  LayoutBuilder,
  MainAxisAlignment,
  MainAxisSize,
  Row,
  SizedBox,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { HeatmapContext } from "@headless/heatmap-chart/types";
import type { AgHeatmapChartConfig } from "../config";

const BAR_HEIGHT = 12;
const LABEL_GAP = 6;
const MAX_BAR_WIDTH = 360;

function generateTicks(min: number, max: number, count: number = 3): number[] {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  const isInt = Number.isInteger(min) && Number.isInteger(max);
  return Array.from({ length: count }, (_, i) => {
    const v = min + i * step;
    return isInt ? Math.round(v) : Math.round(v * 10) / 10;
  });
}

function gradientBar(
  colorRange: [string, string, string],
  barWidth: number,
): Widget {
  return SizedBox({
    height: BAR_HEIGHT,
    child: CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            defs: ctx.createSvgEl("defs"),
            rect: ctx.createSvgEl("rect"),
          }),
          paint: ({ defs, rect }, size) => {
            const gradId = "ag-heatmap-legend-grad";
            defs.innerHTML =
              `<linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">` +
              `<stop offset="0%" stop-color="${colorRange[0]}"/>` +
              `<stop offset="50%" stop-color="${colorRange[1]}"/>` +
              `<stop offset="100%" stop-color="${colorRange[2]}"/>` +
              `</linearGradient>`;
            rect.setAttribute("x", "0");
            rect.setAttribute("y", "0");
            rect.setAttribute("width", `${size.width}`);
            rect.setAttribute("height", `${size.height}`);
            rect.setAttribute("rx", "3");
            rect.setAttribute("fill", `url(#${gradId})`);
          },
        },
        canvas: {
          paint: (context, { width, height }) => {
            const ctx2d = context.canvas;
            const grad = ctx2d.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, colorRange[0]);
            grad.addColorStop(0.5, colorRange[1]);
            grad.addColorStop(1, colorRange[2]);
            ctx2d.fillStyle = grad;
            ctx2d.beginPath();
            ctx2d.roundRect(0, 0, width, height, 3);
            ctx2d.fill();
          },
        },
      },
    }),
  });
}

function buildTickLabels(
  ticks: number[],
  font: { family: string; size: number },
  color: string,
): Widget {
  const style = new TextStyle({
    fontFamily: font.family,
    fontSize: font.size,
    color,
  });
  return Row({
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: ticks.map((t) => Text(`${t}`, { style })),
  });
}

export function agHeatmapLegend(
  _args: undefined,
  context: HeatmapContext<AgHeatmapChartConfig>,
): Widget {
  const { scale, config } = context;
  const ticks = generateTicks(scale.min, scale.max);

  return LayoutBuilder({
    builder: (_ctx, constraints) => {
      const availableWidth =
        Number.isFinite(constraints.maxWidth) && constraints.maxWidth > 0
          ? constraints.maxWidth
          : MAX_BAR_WIDTH;
      const barWidth = Math.min(MAX_BAR_WIDTH, availableWidth);

      return Row({
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox({
            width: barWidth,
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                gradientBar(config.heatmap.colorRange, barWidth),
                SizedBox({ height: LABEL_GAP }),
                buildTickLabels(ticks, config.font, config.axis.label.color),
              ],
            }),
          }),
        ],
      });
    },
  });
}
