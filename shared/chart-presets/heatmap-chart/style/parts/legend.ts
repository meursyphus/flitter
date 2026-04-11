import {
  Column,
  ConstraintsTransformBox,
  CrossAxisAlignment,
  CustomPaint,
  FractionalTranslation,
  LayoutBuilder,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Positioned,
  Row,
  Size,
  SizedBox,
  Stack,
  Text,
  TextStyle,
  type Widget,
} from "flitter-ui";
import type { HeatmapContext } from "flitter-ui/chart";
import type { AgHeatmapChartConfig } from "../config";

const BAR_HEIGHT = 12;
const LABEL_GAP = 6;
const MAX_BAR_WIDTH = 360;
const TRIANGLE_WIDTH = 10;
const TRIANGLE_HEIGHT = 6;
const INDICATOR_GAP = 2;

function generateNiceTicks(min: number, max: number): number[] {
  const range = max - min;
  if (range === 0) return [min];

  const rawStep = range / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceStep =
    [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ??
    rawStep;

  const start = Math.ceil(min / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let v = start; v < max; v += niceStep) {
    ticks.push(Math.round(v * 1000) / 1000);
  }
  return ticks.length > 0 ? ticks : [Math.round((min + max) / 2)];
}

function blackTriangle(): Widget {
  return SizedBox({
    width: TRIANGLE_WIDTH,
    height: TRIANGLE_HEIGHT,
    child: CustomPaint({
      size: new Size({ width: TRIANGLE_WIDTH, height: TRIANGLE_HEIGHT }),
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            fill: ctx.createSvgEl("polygon"),
          }),
          paint: ({ fill }, size) => {
            const w = size.width;
            const h = size.height;
            fill.setAttribute("points", `0,0 ${w},0 ${w / 2},${h}`);
            fill.setAttribute("fill", "#333");
          },
        },
        canvas: {
          paint: (ctx, size) => {
            const c = ctx.canvas;
            const w = size.width;
            const h = size.height;
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(w, 0);
            c.lineTo(w / 2, h);
            c.closePath();
            c.fillStyle = "#333";
            c.fill();
          },
        },
      },
    }),
  });
}

function gradientBar(colorRange: [string, string, string]): Widget {
  return SizedBox({
    height: BAR_HEIGHT,
    child: CustomPaint({
      painter: {
        svg: {
          createDefaultSvgEl: (ctx) => ({
            defs: ctx.createSvgEl("defs"),
            rect: ctx.createSvgEl("rect"),
          }),
          paint: ({ defs, rect }, size) => {
            const gradId = "ag-heatmap-legend-grad";
            defs.innerHTML =
              `<linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">` +
              `<stop offset="0%" stop-color="${colorRange[0]}"/>` +
              `<stop offset="50%" stop-color="${colorRange[1]}"/>` +
              `<stop offset="100%" stop-color="${colorRange[2]}"/>` +
              `</linearGradient>`;
            rect.setAttribute("x", "0");
            rect.setAttribute("y", "0");
            rect.setAttribute("width", `${size.width}`);
            rect.setAttribute("height", `${size.height}`);
            rect.setAttribute("rx", "3");
            rect.setAttribute("fill", `url(#${gradId})`);
          },
        },
        canvas: {
          paint: (context, { width, height }) => {
            const ctx2d = context.canvas;
            const grad = ctx2d.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, colorRange[0]);
            grad.addColorStop(0.5, colorRange[1]);
            grad.addColorStop(1, colorRange[2]);
            ctx2d.fillStyle = grad;
            ctx2d.beginPath();
            ctx2d.roundRect(0, 0, width, height, 3);
            ctx2d.fill();
          },
        },
      },
    }),
  });
}

export function agHeatmapLegend(
  _args: undefined,
  context: HeatmapContext<AgHeatmapChartConfig>,
): Widget {
  const { scale, config } = context;
  const hovered = context.hoveredSegment;
  const ticks = generateNiceTicks(scale.min, scale.max);
  const range = scale.max - scale.min;

  const textStyle = new TextStyle({
    fontFamily: config.font.family,
    fontSize: config.font.size,
    color: config.axis.label.color,
  });

  return LayoutBuilder({
    builder: (_ctx, constraints) => {
      const availableWidth =
        Number.isFinite(constraints.maxWidth) && constraints.maxWidth > 0
          ? constraints.maxWidth
          : MAX_BAR_WIDTH;
      const barWidth = Math.min(MAX_BAR_WIDTH, availableWidth);

      const indicatorRow = SizedBox({
        height: TRIANGLE_HEIGHT + INDICATOR_GAP,
        child:
          hovered != null && range > 0
            ? Stack({
                clipped: false,
                children: [
                  SizedBox.expand(),
                  Positioned({
                    left:
                      ((hovered.value - scale.min) / range) * barWidth -
                      TRIANGLE_WIDTH / 2,
                    bottom: INDICATOR_GAP,
                    child: blackTriangle(),
                  }),
                ],
              })
            : SizedBox.shrink(),
      });

      const tickRow = SizedBox({
        height: 20,
        child: Stack({
          clipped: false,
          children: [
            SizedBox.expand(),
            ...ticks.map((tick) => {
              const fraction =
                range > 0 ? (tick - scale.min) / range : 0.5;
              return Positioned({
                left: fraction * barWidth,
                top: 0,
                child: FractionalTranslation({
                  translation: new Offset({ x: -0.5, y: 0 }),
                  child: ConstraintsTransformBox({
                    constraintsTransform:
                      ConstraintsTransformBox.unconstrained,
                    child: Text(`${tick}`, { style: textStyle }),
                  }),
                }),
              });
            }),
          ],
        }),
      });

      return Row({
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox({
            width: barWidth,
            child: Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                indicatorRow,
                gradientBar(config.heatmap.colorRange),
                SizedBox({ height: LABEL_GAP }),
                tickRow,
              ],
            }),
          }),
        ],
      });
    },
  });
}
