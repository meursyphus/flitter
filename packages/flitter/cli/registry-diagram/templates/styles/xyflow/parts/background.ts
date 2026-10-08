import { CustomPaint, Size, type Widget } from "flitter-core";
import type { BackgroundBuilderArgs, FlowContext } from "../../../headless/flow/types";
import type { XyflowFlowConfig } from "../config";

const defaultSize = { dots: 1, lines: 1, cross: 6 } as const;
let patternCounter = 0;

/** React Flow's `<Background>`: dot, line or cross pattern that follows the viewport. */
export function xyflowBackground(args: BackgroundBuilderArgs, context: FlowContext<XyflowFlowConfig>): Widget | null {
  const { background: bg, colors } = context.config;
  if (!bg.visible) return null;
  const { viewport, width, height } = args;
  const zoom = viewport.zoom;
  const variant = bg.variant;
  const patternSize = bg.size ?? defaultSize[variant];
  const scaledGap = bg.gap * zoom || 1;
  const scaledSize = patternSize * zoom;
  const isDots = variant === "dots";
  const isCross = variant === "cross";
  const patternDimension = isCross ? scaledSize : scaledGap;
  const scaledOffset = 1 + patternDimension / 2;
  const color =
    bg.color ?? (isDots ? colors.patternDots : variant === "lines" ? colors.patternLines : colors.patternCross);
  const fill = colors.background;
  const offsetX = viewport.x % scaledGap;
  const offsetY = viewport.y % scaledGap;
  const lineD = `M${patternDimension / 2} 0 V${patternDimension} M0 ${patternDimension / 2} H${patternDimension}`;
  const dependencies = `${variant}|${scaledGap}|${scaledSize}|${offsetX}|${offsetY}|${width}|${height}|${color}|${fill}|${bg.lineWidth}`;

  return CustomPaint({
    size: new Size({ width, height }),
    painter: {
      dependencies,
      shouldRepaint: (old) => old.dependencies !== dependencies,
      svg: {
        createDefaultSvgEl: (ctx) => {
          const pattern = ctx.createSvgEl("pattern");
          pattern.id = `xyflow-background-${++patternCounter}`;
          pattern.appendChild(ctx.createSvgEl("circle"));
          pattern.appendChild(ctx.createSvgEl("path"));
          return { fill: ctx.createSvgEl("rect"), pattern, rect: ctx.createSvgEl("rect") };
        },
        paint: (els) => {
          const pattern = els.pattern as SVGPatternElement;
          const circle = pattern.children[0] as SVGElement;
          const path = pattern.children[1] as SVGElement;
          els.fill.setAttribute("x", "0");
          els.fill.setAttribute("y", "0");
          els.fill.setAttribute("width", String(width));
          els.fill.setAttribute("height", String(height));
          els.fill.setAttribute("fill", fill);
          pattern.setAttribute("x", String(offsetX));
          pattern.setAttribute("y", String(offsetY));
          pattern.setAttribute("width", String(scaledGap));
          pattern.setAttribute("height", String(scaledGap));
          pattern.setAttribute("patternUnits", "userSpaceOnUse");
          pattern.setAttribute("patternTransform", `translate(${-scaledOffset},${-scaledOffset})`);
          if (isDots) {
            const radius = scaledSize / 2;
            circle.removeAttribute("display");
            circle.setAttribute("cx", String(radius));
            circle.setAttribute("cy", String(radius));
            circle.setAttribute("r", String(radius));
            circle.setAttribute("fill", color);
            path.setAttribute("display", "none");
          } else {
            circle.setAttribute("display", "none");
            path.removeAttribute("display");
            path.setAttribute("d", lineD);
            path.setAttribute("stroke", color);
            path.setAttribute("stroke-width", String(bg.lineWidth));
            path.setAttribute("fill", "none");
          }
          els.rect.setAttribute("x", "0");
          els.rect.setAttribute("y", "0");
          els.rect.setAttribute("width", String(width));
          els.rect.setAttribute("height", String(height));
          els.rect.setAttribute("fill", `url(#${pattern.id})`);
        },
      },
      canvas: {
        paint: (ctx) => {
          const canvas = ctx.canvas;
          canvas.save();
          canvas.fillStyle = fill;
          canvas.fillRect(0, 0, width, height);
          const startX = offsetX - scaledOffset;
          const startY = offsetY - scaledOffset;
          const firstX = startX - Math.ceil(startX / scaledGap) * scaledGap - scaledGap;
          const firstY = startY - Math.ceil(startY / scaledGap) * scaledGap - scaledGap;
          if (isDots) {
            const radius = scaledSize / 2;
            canvas.fillStyle = color;
            canvas.beginPath();
            for (let x = firstX + radius; x < width + scaledGap; x += scaledGap) {
              for (let y = firstY + radius; y < height + scaledGap; y += scaledGap) {
                canvas.moveTo(x + radius, y);
                canvas.arc(x, y, radius, 0, Math.PI * 2);
              }
            }
            canvas.fill();
          } else {
            canvas.strokeStyle = color;
            canvas.lineWidth = bg.lineWidth;
            canvas.beginPath();
            const half = patternDimension / 2;
            for (let x = firstX; x < width + scaledGap; x += scaledGap) {
              for (let y = firstY; y < height + scaledGap; y += scaledGap) {
                canvas.moveTo(x + half, y);
                canvas.lineTo(x + half, y + patternDimension);
                canvas.moveTo(x, y + half);
                canvas.lineTo(x + patternDimension, y + half);
              }
            }
            canvas.stroke();
          }
          canvas.restore();
        },
      },
    },
  });
}
