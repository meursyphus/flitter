import { CustomPaint, type Widget } from "flitter-core";
import type { GaugeChartCustom } from "flitter-ui/chart";
import type { GaugeChartConfig } from "../config";

function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStartX = cx + outerR * Math.cos(startAngle);
  const outerStartY = cy + outerR * Math.sin(startAngle);
  const outerEndX = cx + outerR * Math.cos(endAngle);
  const outerEndY = cy + outerR * Math.sin(endAngle);
  const innerStartX = cx + innerR * Math.cos(endAngle);
  const innerStartY = cy + innerR * Math.sin(endAngle);
  const innerEndX = cx + innerR * Math.cos(startAngle);
  const innerEndY = cy + innerR * Math.sin(startAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerStartX} ${innerStartY}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEndX} ${innerEndY}`,
    `Z`,
  ].join(" ");
}

function tickValues(min: number, max: number, count: number): number[] {
  if (count <= 1 || min === max) return [min, max].filter((v, i, arr) => arr.indexOf(v) === i);
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const value = min + step * i;
    return Number.isInteger(min) && Number.isInteger(max)
      ? Math.round(value)
      : Math.round(value * 10) / 10;
  });
}

function zoneFillSegments(
  min: number,
  value: number,
  zones: { min: number; max: number; color: string }[],
): { min: number; max: number; color: string }[] {
  return zones
    .map((zone) => ({
      min: Math.max(min, zone.min),
      max: Math.min(value, zone.max),
      color: zone.color,
    }))
    .filter((zone) => zone.max > zone.min);
}

export function agScale(
  ...[{ min, max, zones }, ctx]: Parameters<GaugeChartCustom<GaugeChartConfig>["scale"]>
): Widget {
  const value = ctx.value;
  const filledZones = zoneFillSegments(min, value, zones);
  const ticks = tickValues(min, max, ctx.config.gauge.tickCount);

  return CustomPaint({
    painter: {
      svg: {
        createDefaultSvgEl: (context) => {
          const elements: Record<string, SVGElement> = {
            track: context.createSvgEl("path"),
          };
          filledZones.forEach((_, i) => {
            elements[`fill${i}`] = context.createSvgEl("path");
          });
          ticks.forEach((_, i) => {
            elements[`tick${i}`] = context.createSvgEl("text");
          });
          return elements;
        },
        paint: (elements, { width, height }) => {
          const cx = width / 2;
          const cy = height - 6;
          const outerRadius = Math.min(width / 2, height) * 0.84;
          const innerRadius = outerRadius * 0.78;
          const labelRadius = outerRadius + 16;

          elements.track.setAttribute(
            "d",
            describeArc(cx, cy, outerRadius, innerRadius, Math.PI, 2 * Math.PI),
          );
          elements.track.setAttribute("fill", ctx.config.gauge.trackColor);

          filledZones.forEach((zone, i) => {
            const startRatio = (zone.min - min) / (max - min || 1);
            const endRatio = (zone.max - min) / (max - min || 1);
            const startAngle = Math.PI + startRatio * Math.PI;
            const endAngle = Math.PI + endRatio * Math.PI;
            const el = elements[`fill${i}`];
            el.setAttribute(
              "d",
              describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle),
            );
            el.setAttribute("fill", zone.color);
          });

          ticks.forEach((tick, i) => {
            const ratio = (tick - min) / (max - min || 1);
            const angle = Math.PI + ratio * Math.PI;
            const x = cx + labelRadius * Math.cos(angle);
            const y = cy + labelRadius * Math.sin(angle);
            const el = elements[`tick${i}`];
            el.setAttribute("x", `${x}`);
            el.setAttribute("y", `${y}`);
            el.setAttribute("text-anchor", "middle");
            el.setAttribute("dominant-baseline", "middle");
            el.setAttribute("font-size", "11");
            el.setAttribute("font-family", ctx.config.font.family);
            el.setAttribute("fill", ctx.config.gauge.tickColor);
            el.textContent = `${tick}`;
          });
        },
      },
      canvas: {
        paint: (context, { width, height }) => {
          const canvas = context.canvas;
          const cx = width / 2;
          const cy = height - 6;
          const outerRadius = Math.min(width / 2, height) * 0.84;
          const innerRadius = outerRadius * 0.78;
          const labelRadius = outerRadius + 16;

          canvas.fillStyle = ctx.config.gauge.trackColor;
          canvas.beginPath();
          canvas.arc(cx, cy, outerRadius, Math.PI, 2 * Math.PI);
          canvas.arc(cx, cy, innerRadius, 2 * Math.PI, Math.PI, true);
          canvas.closePath();
          canvas.fill();

          filledZones.forEach((zone) => {
            const startRatio = (zone.min - min) / (max - min || 1);
            const endRatio = (zone.max - min) / (max - min || 1);
            const startAngle = Math.PI + startRatio * Math.PI;
            const endAngle = Math.PI + endRatio * Math.PI;

            canvas.fillStyle = zone.color;
            canvas.beginPath();
            canvas.arc(cx, cy, outerRadius, startAngle, endAngle);
            canvas.arc(cx, cy, innerRadius, endAngle, startAngle, true);
            canvas.closePath();
            canvas.fill();
          });

          canvas.fillStyle = ctx.config.gauge.tickColor;
          canvas.font = `11px ${ctx.config.font.family}`;
          canvas.textAlign = "center";
          canvas.textBaseline = "middle";
          ticks.forEach((tick) => {
            const ratio = (tick - min) / (max - min || 1);
            const angle = Math.PI + ratio * Math.PI;
            const x = cx + labelRadius * Math.cos(angle);
            const y = cy + labelRadius * Math.sin(angle);
            canvas.fillText(`${tick}`, x, y);
          });
        },
      },
    },
  });
}
