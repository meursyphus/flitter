import {
  CustomPaint,
  FractionalTranslation,
  LayoutBuilder,
  Offset,
  Positioned,
  Stack,
  StackFit,
  Text,
  TextStyle,
  type Widget,
} from "flitter-core";
import type { PolarAreaChartCustom } from "flitter-ui/chart";
import type { PolarAreaChartConfig } from "../config";

const RING_COUNT = 4;
const OUTER_RADIUS_FACTOR = 0.82;
const LABEL_OFFSET = 18;
const AXIS_COLOR = "#d9dde3";

function ringValues(maxValue: number): number[] {
  return Array.from({ length: RING_COUNT - 1 }, (_, i) =>
    Math.round((maxValue * (i + 1)) / RING_COUNT),
  );
}

export function agScale(
  ...[{ maxValue, count }, ctx]: Parameters<PolarAreaChartCustom<PolarAreaChartConfig>["scale"]>
): Widget {
  const radiusLabels = ringValues(maxValue);

  return LayoutBuilder({
    builder: (_ctx, constraints) => {
      const width = constraints.maxWidth;
      const height = constraints.maxHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 * OUTER_RADIUS_FACTOR;

      const categoryLabels = ctx.data.datasets.map((dataset, index) => {
        const angle = -Math.PI / 2 + ctx.angleStep * index + ctx.angleStep / 2;
        const x = centerX + (radius + LABEL_OFFSET) * Math.cos(angle);
        const y = centerY + (radius + LABEL_OFFSET) * Math.sin(angle);

        return Positioned({
          left: x,
          top: y,
          child: FractionalTranslation({
            translation: new Offset({ x: -0.5, y: -0.5 }),
            child: Text(dataset.name, {
              style: new TextStyle({
                fontFamily: ctx.config.font.family,
                fontSize: 11,
                color: ctx.config.legend.color,
              }),
            }),
          }),
        });
      });

      const radialValueLabels = radiusLabels.map((value, index) => {
        const y = centerY - (radius * (index + 1)) / RING_COUNT;
        return Positioned({
          left: centerX,
          top: y,
          child: FractionalTranslation({
            translation: new Offset({ x: -0.5, y: -1 }),
            child: Text(`${value}`, {
              style: new TextStyle({
                fontFamily: ctx.config.font.family,
                fontSize: 10,
                color: ctx.config.legend.color,
              }),
            }),
          }),
        });
      });

      return Stack({
        fit: StackFit.expand,
        clipped: false,
        children: [
          CustomPaint({
            painter: {
              svg: {
                createDefaultSvgEl: (context) => {
                  const elements: Record<string, SVGElement> = {};
                  for (let i = 1; i <= RING_COUNT; i += 1) {
                    elements[`ring${i}`] = context.createSvgEl("circle");
                  }
                  for (let i = 0; i < count; i += 1) {
                    elements[`spoke${i}`] = context.createSvgEl("line");
                  }
                  return elements;
                },
                paint: (elements) => {
                  for (let i = 1; i <= RING_COUNT; i += 1) {
                    const ring = elements[`ring${i}`];
                    ring.setAttribute("cx", `${centerX}`);
                    ring.setAttribute("cy", `${centerY}`);
                    ring.setAttribute("r", `${(radius * i) / RING_COUNT}`);
                    ring.setAttribute("fill", "none");
                    ring.setAttribute("stroke", AXIS_COLOR);
                    ring.setAttribute("stroke-width", "1");
                  }

                  for (let i = 0; i < count; i += 1) {
                    const angle = -Math.PI / 2 + ctx.angleStep * i;
                    const spoke = elements[`spoke${i}`];
                    spoke.setAttribute("x1", `${centerX}`);
                    spoke.setAttribute("y1", `${centerY}`);
                    spoke.setAttribute("x2", `${centerX + radius * Math.cos(angle)}`);
                    spoke.setAttribute("y2", `${centerY + radius * Math.sin(angle)}`);
                    spoke.setAttribute("stroke", AXIS_COLOR);
                    spoke.setAttribute("stroke-width", "1");
                  }
                },
              },
              canvas: {
                paint: (context) => {
                  const canvas = context.canvas;
                  canvas.strokeStyle = AXIS_COLOR;
                  canvas.lineWidth = 1;

                  for (let i = 1; i <= RING_COUNT; i += 1) {
                    canvas.beginPath();
                    canvas.arc(centerX, centerY, (radius * i) / RING_COUNT, 0, Math.PI * 2);
                    canvas.stroke();
                  }

                  for (let i = 0; i < count; i += 1) {
                    const angle = -Math.PI / 2 + ctx.angleStep * i;
                    canvas.beginPath();
                    canvas.moveTo(centerX, centerY);
                    canvas.lineTo(
                      centerX + radius * Math.cos(angle),
                      centerY + radius * Math.sin(angle),
                    );
                    canvas.stroke();
                  }
                },
              },
            },
          }),
          ...radialValueLabels,
          ...categoryLabels,
        ],
      });
    },
  });
}
