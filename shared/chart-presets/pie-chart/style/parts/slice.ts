import {
  CustomPaint,
  GestureDetector,
  Offset,
  Opacity,
  Path,
  Radius,
  type Size,
  type Widget,
} from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { AgPieChartConfig } from "../config";

export function agSlice(
  ...[{ index, name, sweepAngle }, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["slice"]>
): Widget {
  const { colors, pie: pieConfig } = ctx.config;
  const colorIndex = ctx.legends.indexOf(name);
  const fill = colors.fills[(colorIndex >= 0 ? colorIndex : index) % colors.fills.length];
  const hovered = ctx.isSliceHovered(index);

  let opacity = 1;
  if (ctx.hoveredIndex != null) {
    opacity = hovered ? 1 : 0.35;
  }

  const paint = CustomPaint({
    painter: {
      hitTest: (position, size) =>
        isPointInSlice(position, size, pieConfig.innerRadiusRatio, sweepAngle),
      svg: {
        createDefaultSvgEl: (context) => ({
          slice: context.createSvgEl("path"),
        }),
        paint: ({ slice }, size) => {
          const cx = size.width / 2;
          const cy = size.height / 2;
          const radius = Math.min(cx, cy);
          const innerRadius = radius * pieConfig.innerRadiusRatio;
          const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle);
          slice.setAttribute("d", path.getD());
          slice.setAttribute("fill", fill);
          slice.setAttribute("stroke", pieConfig.strokeColor);
          slice.setAttribute("stroke-width", String(pieConfig.strokeWidth));
        },
      },
      canvas: {
        paint: (context, size) => {
          const cx = size.width / 2;
          const cy = size.height / 2;
          const radius = Math.min(cx, cy);
          const innerRadius = radius * pieConfig.innerRadiusRatio;
          const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle);
          const canvasPath = path.toCanvasPath();
          context.canvas.fillStyle = fill;
          context.canvas.fill(canvasPath);
          context.canvas.strokeStyle = pieConfig.strokeColor;
          context.canvas.lineWidth = pieConfig.strokeWidth;
          context.canvas.stroke(canvasPath);
        },
      },
    },
  });

  const detector = GestureDetector({
    behavior: "deferToChild",
    cursor: "default",
    child: paint,
    onMouseEnter: () => ctx.hoverSlice(index),
    onMouseLeave: () => {
      if (ctx.hoveredIndex === index) ctx.unhoverSlice();
    },
  });

  return opacity < 1 ? Opacity({ opacity, child: detector }) : detector;
}

function isPointInSlice(
  position: { x: number; y: number },
  size: Size,
  innerRadiusRatio: number,
  sweepAngle: number,
): boolean {
  const cx = size.width / 2;
  const cy = size.height / 2;
  const dx = position.x - cx;
  const dy = position.y - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const outerRadius = Math.min(cx, cy);
  const innerRadius = outerRadius * innerRadiusRatio;

  if (distance < innerRadius || distance > outerRadius) return false;

  let angle = Math.atan2(dy, dx);
  let relativeAngle = angle - (-Math.PI / 2);
  if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

  return relativeAngle <= sweepAngle;
}

function createSlicePath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  sweepAngle: number,
): Path {
  const path = new Path();

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + sweepAngle;

  const outerStart = new Offset({
    x: cx + outerRadius * Math.cos(startAngle),
    y: cy + outerRadius * Math.sin(startAngle),
  });
  const outerEnd = new Offset({
    x: cx + outerRadius * Math.cos(endAngle),
    y: cy + outerRadius * Math.sin(endAngle),
  });

  if (innerRadius > 0) {
    const innerStart = new Offset({
      x: cx + innerRadius * Math.cos(startAngle),
      y: cy + innerRadius * Math.sin(startAngle),
    });
    const innerEnd = new Offset({
      x: cx + innerRadius * Math.cos(endAngle),
      y: cy + innerRadius * Math.sin(endAngle),
    });

    path.moveTo(outerStart);
    path.arcToPoint({
      endPoint: outerEnd,
      radius: Radius.circular(outerRadius),
      rotation: 0,
      largeArc: sweepAngle > Math.PI,
      clockwise: true,
    });
    path.lineTo(innerEnd);
    path.arcToPoint({
      endPoint: innerStart,
      radius: Radius.circular(innerRadius),
      rotation: 0,
      largeArc: sweepAngle > Math.PI,
      clockwise: false,
    });
    path.close();
  } else {
    path.moveTo(new Offset({ x: cx, y: cy }));
    path.lineTo(outerStart);
    path.arcToPoint({
      endPoint: outerEnd,
      radius: Radius.circular(outerRadius),
      rotation: 0,
      largeArc: sweepAngle > Math.PI,
      clockwise: true,
    });
    path.close();
  }

  return path;
}
