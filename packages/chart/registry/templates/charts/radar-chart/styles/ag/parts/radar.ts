import {
  CustomPaint,
  Offset,
  Path,
  type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { AgRadarChartConfig } from "../config";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agTooltipContent } from "@styles/ag";

export function agRadar(
  ...[{ legend, index, vertices }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["radar"]>
): Widget {
  const { colors, radar: radarConfig } = ctx.config;
  const colorIndex = ctx.legends.indexOf(legend);
  const fillColor = colors.fills[(colorIndex >= 0 ? colorIndex : index) % colors.fills.length];
  const strokeColor = colors.strokes[(colorIndex >= 0 ? colorIndex : index) % colors.strokes.length];
  const hoveredRadar = ctx.hoveredRadar;
  const isHovered = ctx.isRadarHovered(index, legend);
  const hasActiveHover = hoveredRadar != null;
  const fillOpacity = hasActiveHover
    ? isHovered
      ? radarConfig.fillOpacity
      : Math.max(0.08, radarConfig.fillOpacity * 0.35)
    : radarConfig.fillOpacity;
  const strokeOpacity = hasActiveHover
    ? isHovered
      ? 1
      : 0.3
    : 1;

  return new HoverTooltip({
    position: "topCenter",
    tooltip: agTooltipContent({
      label: legend,
      items: vertices.map((vertex) => ({
        legend: vertex.label,
        color: fillColor,
        value: vertex.value,
      })),
      config: ctx.config as any,
    }),
    renderChild: () =>
      CustomPaint({
        painter: {
          hitTest: (position, size) =>
            isPointInPolygon(
              position,
              vertices.map((vertex) => ({
                x: vertex.nx * size.width,
                y: vertex.ny * size.height,
              })),
            ),
          svg: {
            createDefaultSvgEl: (context) => ({
              fill: context.createSvgEl("path"),
              stroke: context.createSvgEl("path"),
            }),
            paint: ({ fill, stroke }, size) => {
              const path = createDatasetPath(vertices, size.width, size.height);
              const d = path.getD();

              fill.setAttribute("d", d);
              fill.setAttribute("fill", fillColor);
              fill.setAttribute("fill-opacity", String(fillOpacity));
              fill.setAttribute("stroke", "none");

              stroke.setAttribute("d", d);
              stroke.setAttribute("fill", "none");
              stroke.setAttribute("stroke", strokeColor);
              stroke.setAttribute("stroke-width", String(radarConfig.strokeWidth));
              stroke.setAttribute("stroke-opacity", String(strokeOpacity));
            },
          },
          canvas: {
            paint: (context, size) => {
              const path = createDatasetPath(vertices, size.width, size.height);
              const canvasPath = path.toCanvasPath();
              const canvas = context.canvas;

              canvas.globalAlpha = fillOpacity;
              canvas.fillStyle = fillColor;
              canvas.fill(canvasPath);
              canvas.globalAlpha = strokeOpacity;
              canvas.strokeStyle = strokeColor;
              canvas.lineWidth = radarConfig.strokeWidth;
              canvas.stroke(canvasPath);
              canvas.globalAlpha = 1;
            },
          },
        },
      }),
    offset: new Offset({ x: 0, y: -0.15 }),
    cursor: "default",
  });
}

function createDatasetPath(
  vertices: { nx: number; ny: number }[],
  width: number,
  height: number,
): Path {
  const path = new Path();
  if (vertices.length === 0) return path;

  for (let i = 0; i <= vertices.length; i++) {
    const v = vertices[i % vertices.length];
    const x = v.nx * width;
    const y = v.ny * height;
    if (i === 0) {
      path.moveTo(new Offset({ x, y }));
    } else {
      path.lineTo(new Offset({ x, y }));
    }
  }
  path.close();
  return path;
}

function isPointInPolygon(
  position: { x: number; y: number },
  points: { x: number; y: number }[],
): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;

    const intersects =
      yi > position.y !== yj > position.y &&
      position.x < ((xj - xi) * (position.y - yi)) / ((yj - yi) || 0.00001) + xi;

    if (intersects) inside = !inside;
  }
  return inside;
}
