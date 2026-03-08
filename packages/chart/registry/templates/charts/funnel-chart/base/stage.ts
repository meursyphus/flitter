import type { FunnelChartCustom } from "../types";
import {
  Alignment,
  BoxDecoration,
  Border,
  BoxShadow,
  Container,
  CustomPaint,
  EdgeInsets,
  FractionallySizedBox,
  Row,
  SizedBox,
  Stack,
  MainAxisAlignment,
  type Widget,
} from "flitter-core";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "@styles/ag";

export function Stage(
  ...[{ index, label, value, ratio, color, stageLabel, dataLabel }]: Parameters<
    FunnelChartCustom["stage"]
  >
): Widget {
  return SizedBox({
    height: 40,
    child: new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label,
        items: { legend: `Stage ${index + 1}`, color, value },
        config: defaultAgCartesianBaseConfig,
      }),
      renderChild: (hovered) =>
        FractionallySizedBox({
          widthFactor: Math.max(ratio, 0.05),
          child: Stack({
            alignment: Alignment.center,
            children: [
              CustomPaint({
                painter: {
                  svg: {
                    createDefaultSvgEl: (context) => ({
                      rect: context.createSvgEl("rect"),
                    }),
                    paint: ({ rect }, { width, height }) => {
                      rect.setAttribute("x", "0");
                      rect.setAttribute("y", "0");
                      rect.setAttribute("width", String(width));
                      rect.setAttribute("height", String(height));
                      rect.setAttribute("fill", color);
                      rect.setAttribute("rx", "4");
                      if (hovered) {
                        rect.setAttribute("stroke", "white");
                        rect.setAttribute("stroke-width", "2");
                      }
                    },
                  },
                  canvas: {
                    paint: (context, { width, height }) => {
                      const ctx = context.canvas;
                      ctx.fillStyle = color;
                      ctx.beginPath();
                      ctx.roundRect(0, 0, width, height, 4);
                      ctx.fill();
                      if (hovered) {
                        ctx.strokeStyle = "white";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                      }
                    },
                  },
                },
              }),
              Container({
                decoration: hovered
                  ? new BoxDecoration({
                      border: Border.all({ color: "rgba(255,255,255,0.45)", width: 1 }),
                      boxShadow: [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })],
                    })
                  : undefined,
                child: Row({
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container({
                      margin: EdgeInsets.only({ right: 8 }),
                      child: stageLabel,
                    }),
                    dataLabel,
                  ],
                }),
              }),
            ],
          }),
        }),
    }),
  });
}
