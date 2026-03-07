import type { FunnelChartCustom } from "../types";
import {
  Alignment,
  Container,
  CustomPaint,
  EdgeInsets,
  FractionallySizedBox,
  Path,
  Row,
  SizedBox,
  Stack,
  MainAxisAlignment,
  type Widget,
} from "flitter-core";

export function Stage(
  ...[{ ratio, color, stageLabel, dataLabel }, { data }]: Parameters<
    FunnelChartCustom["stage"]
  >
): Widget {
  return SizedBox({
    height: 40,
    child: FractionallySizedBox({
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
                },
              },
              canvas: {
                paint: (context, { width, height }) => {
                  const ctx = context.canvas;
                  ctx.fillStyle = color;
                  ctx.beginPath();
                  ctx.roundRect(0, 0, width, height, 4);
                  ctx.fill();
                },
              },
            },
          }),
          Row({
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container({
                margin: EdgeInsets.only({ right: 8 }),
                child: stageLabel,
              }),
              dataLabel,
            ],
          }),
        ],
      }),
    }),
  });
}
