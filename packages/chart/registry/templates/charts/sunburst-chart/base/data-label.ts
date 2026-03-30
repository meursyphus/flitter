import type { SunburstCustom } from "../types";
import { CustomPaint, Opacity, type Widget } from "flitter-core";
import {
  getRingMetrics,
  getSegmentLabelMetrics,
  isSegmentHovered,
} from "./geometry";

export function DataLabel(
  ...[{ segment }, ctx]: Parameters<SunburstCustom["dataLabel"]>
): Widget {
  const isHovered = isSegmentHovered(ctx.hoveredSegment, segment);
  const hasHover = ctx.hoveredSegment != null;

  return Opacity({
    opacity: hasHover ? (isHovered ? 1 : 0.35) : 1,
    child: CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (context) => ({
            label: context.createSvgEl("text"),
            value: context.createSvgEl("text"),
          }),
          paint: ({ label, value }, size) => {
            const metrics = getRingMetrics(size.width, size.height, ctx.segments);
            if (!metrics) {
              label.setAttribute("visibility", "hidden");
              value.setAttribute("visibility", "hidden");
              return;
            }

            const { midAngle, arcLength, ringWidth, x, y } = getSegmentLabelMetrics(metrics, segment);

            if (arcLength < 20 || ringWidth < 16) {
              label.setAttribute("visibility", "hidden");
              value.setAttribute("visibility", "hidden");
              return;
            }

            let rotation = (midAngle * 180) / Math.PI;
            const needsFlip = rotation > 90 && rotation < 270;
            if (needsFlip) rotation += 180;

            const nodeLabel = segment.node.label;
            const nodeValue = segment.node.value;
            const fontSize = Math.min(11, Math.max(8, ringWidth * 0.28));
            const charWidth = fontSize * 0.6;
            const maxChars = Math.floor(arcLength / charWidth);

            if (maxChars < 2) {
              label.setAttribute("visibility", "hidden");
              value.setAttribute("visibility", "hidden");
              return;
            }

            let displayLabel = nodeLabel;
            if (displayLabel.length > maxChars) {
              displayLabel = displayLabel.slice(0, maxChars - 1) + "…";
            }

            label.setAttribute("visibility", "visible");
            label.setAttribute("x", String(x));
            label.setAttribute("y", String(y));
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("dominant-baseline", nodeValue != null ? "auto" : "central");
            label.setAttribute("fill", "white");
            label.setAttribute("font-size", String(fontSize));
            label.setAttribute("font-weight", "600");
            label.setAttribute("font-family", "system-ui, sans-serif");
            label.setAttribute("transform", `rotate(${rotation}, ${x}, ${y})`);
            label.textContent = displayLabel;

            if (nodeValue != null && arcLength > 40) {
              const valueFontSize = Math.max(7, fontSize - 1);
              value.setAttribute("visibility", "visible");
              value.setAttribute("x", String(x));
              value.setAttribute("y", String(y + fontSize * 0.9));
              value.setAttribute("text-anchor", "middle");
              value.setAttribute("dominant-baseline", "auto");
              value.setAttribute("fill", "rgba(255,255,255,0.8)");
              value.setAttribute("font-size", String(valueFontSize));
              value.setAttribute("font-family", "system-ui, sans-serif");
              value.setAttribute(
                "transform",
                `rotate(${rotation}, ${x}, ${y + fontSize * 0.9})`,
              );
              value.textContent = formatValue(nodeValue);
            } else {
              value.setAttribute("visibility", "hidden");
            }
          },
        },
        canvas: {
          paint: (context, size) => {
            const metrics = getRingMetrics(size.width, size.height, ctx.segments);
            if (!metrics) return;

            const { midAngle, arcLength, ringWidth, x, y } = getSegmentLabelMetrics(metrics, segment);

            if (arcLength < 20 || ringWidth < 16) return;

            let rotation = midAngle;
            const needsFlip = rotation > Math.PI / 2 && rotation < (3 * Math.PI) / 2;
            if (needsFlip) rotation += Math.PI;
            rotation -= Math.PI / 2;

            const nodeLabel = segment.node.label;
            const nodeValue = segment.node.value;
            const fontSize = Math.min(11, Math.max(8, ringWidth * 0.28));
            const charWidth = fontSize * 0.6;
            const maxChars = Math.floor(arcLength / charWidth);

            if (maxChars < 2) return;

            let displayLabel = nodeLabel;
            if (displayLabel.length > maxChars) {
              displayLabel = displayLabel.slice(0, maxChars - 1) + "…";
            }

            const canvas = context.canvas;
            canvas.save();
            canvas.translate(x, y);
            canvas.rotate(rotation);

            canvas.font = `600 ${fontSize}px system-ui, sans-serif`;
            canvas.fillStyle = "white";
            canvas.textAlign = "center";
            canvas.textBaseline = nodeValue != null ? "bottom" : "middle";
            canvas.fillText(displayLabel, 0, 0);

            if (nodeValue != null && arcLength > 40) {
              const valueFontSize = Math.max(7, fontSize - 1);
              canvas.font = `${valueFontSize}px system-ui, sans-serif`;
              canvas.fillStyle = "rgba(255,255,255,0.8)";
              canvas.textBaseline = "top";
              canvas.fillText(formatValue(nodeValue), 0, 2);
            }

            canvas.restore();
          },
        },
      },
    }),
  });
}

function formatValue(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}
