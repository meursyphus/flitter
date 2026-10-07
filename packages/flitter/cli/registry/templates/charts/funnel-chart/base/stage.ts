import {
  Align,
  Alignment,
  CustomPaint,
  LayoutBuilder,
  Opacity,
  Positioned,
  Stack,
  StackFit,
  Text,
  TextStyle,
  ZIndex,
  SizedBox,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";
import type { FunnelAppearance } from "./config";
import { stageContains, stageGeometry } from "./geometry";

export function Stage(
  args: Parameters<FunnelChartCustom["stage"]>[0],
  ctx: { config: FunnelAppearance },
  paint: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    shadow: string | null;
    opacity: number;
  },
) {
  return ZIndex({
    zIndex: args.isHovered ? 1 : 0,
    child: Opacity({
      opacity: paint.opacity,
      child: CustomPaint({
        painter: {
          hitTest: (position, size) =>
            stageContains(
              position,
              stageGeometry(args, size.width, size.height, ctx.config),
            ),
          svg: {
            createDefaultSvgEl: (context) => ({
              path: context.createSvgEl("path"),
            }),
            paint: ({ path }, size) => {
              path.setAttribute(
                "d",
                stageGeometry(
                  args,
                  size.width,
                  size.height,
                  ctx.config,
                ).path.getD(),
              );
              path.setAttribute("fill", paint.fill);
              path.setAttribute("stroke", paint.stroke);
              path.setAttribute("stroke-width", String(paint.strokeWidth));
              if (paint.shadow)
                path.setAttribute(
                  "filter",
                  `drop-shadow(0 0 6px ${paint.shadow})`,
                );
              else path.removeAttribute("filter");
            },
          },
          canvas: {
            paint: (context, size) => {
              const path = stageGeometry(
                args,
                size.width,
                size.height,
                ctx.config,
              ).path.toCanvasPath();
              const canvas = context.canvas;
              canvas.save();
              canvas.fillStyle = paint.fill;
              canvas.fill(path);
              canvas.strokeStyle = paint.stroke;
              canvas.lineWidth = paint.strokeWidth;
              if (paint.shadow) {
                canvas.shadowColor = paint.shadow;
                canvas.shadowBlur = 6;
              }
              if (paint.strokeWidth > 0) canvas.stroke(path);
              canvas.restore();
            },
          },
        },
        child: LayoutBuilder({
          builder: (_, constraints) => {
            const { plotWidth } = stageGeometry(
              args,
              constraints.maxWidth,
              constraints.maxHeight,
              ctx.config,
            );
            return Stack({
              fit: StackFit.expand,
              children:
                constraints.maxWidth - plotWidth < 24
                  ? []
                  : [
                      Positioned({
                        left: plotWidth + 12,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        child: Align({
                          alignment: Alignment.centerLeft,
                          child: args.dataLabel,
                        }),
                      }),
                    ],
            });
          },
        }),
      }),
    }),
  });
}

export function DataLabel(
  args: Parameters<FunnelChartCustom["dataLabel"]>[0],
  ctx: { config: FunnelAppearance & { font: { family: string } } },
) {
  if (!ctx.config.dataLabel.visible) return SizedBox.shrink();
  return Text(ctx.config.dataLabel.formatter(args), {
    style: new TextStyle({
      fontFamily: ctx.config.font.family,
      fontSize: ctx.config.dataLabel.fontSize,
      color: ctx.config.dataLabel.color,
    }),
  });
}
