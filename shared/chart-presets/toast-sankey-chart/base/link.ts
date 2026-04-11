import type { SankeyChartCustom } from "../types";
import { CustomPaint, Path, Positioned, Stack, StackFit, Align, Alignment, Opacity, SizedBox } from "flitter-ui";

export function Link(
  ...[{ color, ribbon, labelAnchor, labelWidget, isHovered, isActive, isDimmed }]: Parameters<
    SankeyChartCustom["link"]
  >
) {
  const opacity = isDimmed ? 0.12 : isHovered ? 0.85 : isActive ? 0.72 : 0.4;
  const shouldStroke = isHovered;

  return Opacity({
    opacity,
    child: Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        CustomPaint({
          painter: {
            svg: {
              createDefaultSvgEl: (context) => ({
                path: context.createSvgEl("path"),
              }),
              paint: ({ path }, size) => {
                const d = createLinkPath(ribbon, size.width, size.height);
                path.setAttribute("d", d.getD());
                path.setAttribute("fill", color);
                if (shouldStroke) {
                  path.setAttribute("stroke", "rgba(255,255,255,0.95)");
                  path.setAttribute("stroke-width", "1.5");
                } else {
                  path.setAttribute("stroke", "none");
                }
              },
            },
            canvas: {
              paint: (context, size) => {
                const d = createLinkPath(ribbon, size.width, size.height);
                const canvas = context.canvas;
                canvas.fillStyle = color;
                canvas.fill(d.toCanvasPath());
                if (shouldStroke) {
                  canvas.strokeStyle = "rgba(255,255,255,0.95)";
                  canvas.lineWidth = 1.5;
                  canvas.stroke(d.toCanvasPath());
                }
              },
            },
          },
        }),
        labelWidget == null
          ? SizedBox.shrink()
          : Positioned.fill({
              child: Align({
                alignment: new Alignment({
                  x: labelAnchor.x * 2 - 1,
                  y: labelAnchor.y * 2 - 1,
                }),
                child: labelWidget,
              }),
            }),
      ],
    }),
  });
}

function createLinkPath(
  ribbon: Parameters<SankeyChartCustom["link"]>[0]["ribbon"],
  width: number,
  height: number,
) {
  const startTop = {
    x: ribbon.startTop.x * width,
    y: ribbon.startTop.y * height,
  };
  const startBottom = {
    x: ribbon.startBottom.x * width,
    y: ribbon.startBottom.y * height,
  };
  const endTop = {
    x: ribbon.endTop.x * width,
    y: ribbon.endTop.y * height,
  };
  const endBottom = {
    x: ribbon.endBottom.x * width,
    y: ribbon.endBottom.y * height,
  };
  const midX = (startTop.x + endTop.x) / 2;

  const path = new Path();
  path.moveTo(startTop);
  path.cubicTo({
    startControlPoint: { x: midX, y: startTop.y },
    endControlPoint: { x: midX, y: endTop.y },
    endPoint: endTop,
  });
  path.lineTo(endBottom);
  path.cubicTo({
    startControlPoint: { x: midX, y: endBottom.y },
    endControlPoint: { x: midX, y: startBottom.y },
    endPoint: startBottom,
  });
  path.close();
  return path;
}
