import type { SunburstCustom } from "../types";
import { CustomPaint, Opacity, type Widget } from "flitter-core";
import { HoverTooltip } from "flitter-ui/chart";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";
import {
  getRingMetrics,
  createArcPath,
  createArcCanvasPath,
  isPointInSegment,
  isSegmentHovered,
} from "./geometry";

export function Segment(
  ...[{ segment }, ctx]: Parameters<SunburstCustom["segment"]>
): Widget {
  const isHovered = isSegmentHovered(ctx.hoveredSegment, segment);
  const hasHover = ctx.hoveredSegment != null;

  return new HoverTooltip({
    position: "topCenter",
    behavior: "deferToChild",
    tooltip: agTooltipContent({
      label: segment.path.slice(1).join(" / ") || segment.node.label,
      items: {
        legend: segment.node.label,
        color: segment.color,
        value: segment.computedValue,
      },
      config: defaultAgCartesianBaseConfig,
    }),
    onMouseEnter: () => ctx.hoverSegment(segment),
    onMouseLeave: () => ctx.unhoverSegment(),
    renderChild: () =>
      Opacity({
        opacity: hasHover ? (isHovered ? 1 : 0.35) : 1,
        child: CustomPaint({
          painter: {
            hitTest: (position, size) => {
              const metrics = getRingMetrics(size.width, size.height, ctx.segments);
              if (!metrics) return false;
              return isPointInSegment(position, metrics, segment);
            },
            svg: {
              createDefaultSvgEl: (context) => ({
                path: context.createSvgEl("path"),
              }),
              paint: ({ path }, size) => {
                const metrics = getRingMetrics(size.width, size.height, ctx.segments);
                if (!metrics) return;
                const d = createArcPath(metrics, segment);
                path.setAttribute("d", d);
                path.setAttribute("fill", segment.color);
                path.setAttribute("stroke", "white");
                path.setAttribute("stroke-width", String(isHovered ? 2 : 1));
                if (isHovered) {
                  path.setAttribute("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.24))");
                } else {
                  path.removeAttribute("filter");
                }
              },
            },
            canvas: {
              paint: (context, size) => {
                const metrics = getRingMetrics(size.width, size.height, ctx.segments);
                if (!metrics) return;
                const segmentPath = createArcCanvasPath(metrics, segment);
                const canvas = context.canvas;
                canvas.fillStyle = segment.color;
                canvas.fill(segmentPath);
                canvas.strokeStyle = "white";
                canvas.lineWidth = isHovered ? 2 : 1;
                if (isHovered) {
                  canvas.shadowColor = "rgba(0,0,0,0.24)";
                  canvas.shadowBlur = 8;
                }
                canvas.stroke(segmentPath);
                canvas.shadowBlur = 0;
              },
            },
          },
        }),
      }),
  });
}
