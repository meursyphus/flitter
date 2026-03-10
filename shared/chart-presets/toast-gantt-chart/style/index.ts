import type { GanttChartCustom } from "flitter-ui/chart";
import {
  AnimatedScale,
  CustomPaint,
  Column,
  Row,
  Expanded,
  Container,
  Center,
  Stack,
  Positioned,
  LayoutBuilder,
  Text,
  TextStyle,
  SizedBox,
  BoxDecoration,
  Border,
  BorderRadius,
  BoxShadow,
  Path,
  Radius,
  Transform,
} from "flitter-core";
import type { GanttChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { tooltipContent } from "../../_styles/toast/index";

export { type GanttChartConfig } from "./config";

const toastCustom: Partial<GanttChartCustom<GanttChartConfig>> = {
  layout: ({ title, plot, legends }) =>
    Container({
      width: Infinity,
      height: Infinity,
      child: Column({
        children: [
          title,
          ...(legends.length > 0 ? [SizedBox({ height: 8 }), Row({ children: legends })] : []),
          SizedBox({ height: 8 }),
          Expanded({ child: plot }),
        ],
      }),
    }),
  plot: ({ xAxis, yAxisLabels, dataView }, ctx) =>
    LayoutBuilder({
      builder: (_ctx, constraints) => {
        const axisHeight = 40;
        const rowTop = axisHeight + 8;
        const rowHeight = ctx.config.gantt.rowHeight;

        return Stack({
          children: [
            Positioned({
              top: 0,
              left: 0,
              right: 0,
              height: axisHeight,
              child: xAxis,
            }),
            Positioned({
              top: rowTop,
              left: 0,
              right: 0,
              bottom: 0,
              child: Row({
                children: [
                  SizedBox({
                    width: 120,
                    child: Stack({
                      children: yAxisLabels.map((label, index) =>
                        Positioned({
                          top: index * rowHeight,
                          left: 0,
                          right: 0,
                          child: label,
                        }),
                      ),
                    }),
                  }),
                  SizedBox({ width: 12 }),
                  Expanded({ child: dataView }),
                ],
              }),
            }),
          ],
        });
      },
    }),
  dataView: ({ taskBars, dependencies }, ctx) =>
    SizedBox.expand({
      child: Stack({
        children: [
          ...dependencies.map((dependency, index) =>
            Positioned({
              key: `dependency-${index}`,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              child: dependency,
            }),
          ),
          ...taskBars.map((taskBar, index) =>
            Positioned({
              top: index * ctx.config.gantt.rowHeight,
              left: 0,
              right: 0,
              height: ctx.config.gantt.rowHeight - 4,
              child: taskBar,
            }),
          ),
        ],
      }),
    }),
  taskBar: ({ task, startRatio, widthRatio }, ctx) =>
    SizedBox({
      height: ctx.config.gantt.rowHeight - 4,
      child: LayoutBuilder({
        builder: (_ctx, constraints) => {
          const left = constraints.maxWidth * startRatio;
          const width = Math.max(2, constraints.maxWidth * widthRatio);
          const colorIndex = Math.max(0, ctx.groups.indexOf(task.group ?? ""));
          const color = ctx.config.colors[colorIndex % ctx.config.colors.length];

          return Stack({
            children: [
              Positioned({
                left,
                top: (ctx.config.gantt.rowHeight - 4 - ctx.config.gantt.barHeight) / 2,
                width,
                height: ctx.config.gantt.barHeight,
                child: new HoverTooltip({
                  position: "topCenter",
                  tooltip: tooltipContent({
                    label: task.label,
                    items: {
                      legend: task.group ?? "Task",
                      color,
                      value: task.end - task.start,
                    },
                    config: ctx.config as any,
                  }),
                  renderChild: (hovered) =>
                    AnimatedScale({
                      duration: ctx.config.animation.duration,
                      scale: hovered ? 1.02 : 1,
                      child: Container({
                        decoration: new BoxDecoration({
                          color,
                          borderRadius: BorderRadius.all(Radius.circular(4)),
                          border:
                            hovered
                              ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                              : undefined,
                          boxShadow: hovered
                            ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
                            : undefined,
                        }),
                      }),
                    }),
                }),
              }),
            ],
          });
        },
      }),
    }),
  milestone: ({ startRatio }, ctx) =>
    SizedBox({
      height: ctx.config.gantt.rowHeight - 4,
      child: LayoutBuilder({
        builder: (_ctx, constraints) => {
          const left = constraints.maxWidth * startRatio - 7;

          return Stack({
            children: [
              Positioned({
                left,
                top: 9,
                width: 14,
                height: 14,
                child: Center({
                  child: Transform.rotate({
                    angle: Math.PI / 4,
                    child: Container({
                      width: 10,
                      height: 10,
                      color: ctx.config.gantt.milestoneColor,
                    }),
                  }),
                }),
              }),
            ],
          });
        },
      }),
    }),
  dependency: ({ fromTaskId, toTaskId, fromIndex, toIndex, fromRatio, toRatio }, ctx) =>
    new HoverTooltip({
      position: "topCenter",
      tooltip: tooltipContent({
        label: `${fromTaskId} -> ${toTaskId}`,
        items: {
          legend: "Dependency",
          color: ctx.config.gantt.dependencyColor,
          value: Math.max(1, toIndex - fromIndex),
        },
        config: ctx.config as any,
      }),
      renderChild: (hovered) =>
        CustomPaint({
          painter: {
            hitTest: (position, size) =>
              isPointNearDependency(
                position,
                createDependencySegments({
                  fromIndex,
                  toIndex,
                  fromRatio,
                  toRatio,
                  width: size.width,
                  rowHeight: ctx.config.gantt.rowHeight,
                  barHeight: ctx.config.gantt.barHeight,
                }),
              ),
            svg: {
              createDefaultSvgEl: (context) => ({
                dependency: context.createSvgEl("path"),
              }),
              paint: ({ dependency }, size) => {
                const geometry = createDependencyGeometry({
                  fromIndex,
                  toIndex,
                  fromRatio,
                  toRatio,
                  width: size.width,
                  rowHeight: ctx.config.gantt.rowHeight,
                  barHeight: ctx.config.gantt.barHeight,
                });
                const path = createDependencyPath(geometry.points);
                dependency.setAttribute("d", path.getD());
                dependency.setAttribute("fill", "none");
                dependency.setAttribute("stroke", ctx.config.gantt.dependencyColor);
                dependency.setAttribute("stroke-width", hovered ? "2.5" : "1.5");
                dependency.setAttribute("stroke-linecap", "round");
                dependency.setAttribute("stroke-linejoin", "round");
              },
            },
            canvas: {
              paint: (context, size) => {
                const geometry = createDependencyGeometry({
                  fromIndex,
                  toIndex,
                  fromRatio,
                  toRatio,
                  width: size.width,
                  rowHeight: ctx.config.gantt.rowHeight,
                  barHeight: ctx.config.gantt.barHeight,
                });
                const path = createDependencyPath(geometry.points);
                const canvas = context.canvas;
                canvas.strokeStyle = ctx.config.gantt.dependencyColor;
                canvas.lineWidth = hovered ? 2.5 : 1.5;
                canvas.lineCap = "round";
                canvas.lineJoin = "round";
                if (hovered) {
                  canvas.shadowColor = "rgba(0,0,0,0.18)";
                  canvas.shadowBlur = 8;
                }
                canvas.stroke(path.toCanvasPath());
                canvas.shadowBlur = 0;
              },
            },
          },
        }),
    }),
  xAxis: ({ line, labels }) =>
    Column({
      children: [line, SizedBox({ height: 4 }), Row({ children: labels })],
    }),
  xAxisLabel: ({ name }, ctx) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666", fontFamily: ctx.config.font.family }),
    }),
  xAxisTick: () => Container({ width: 1, height: 6, color: "#bbbbbb" }),
  xAxisLine: () => Container({ width: Infinity, height: 1, color: "#dddddd" }),
  yAxisLabel: ({ name }, ctx) =>
    Container({
      width: 120,
      height: 32,
      child: Text(name, {
        style: new TextStyle({ fontSize: 12, color: "#333333", fontFamily: ctx.config.font.family }),
      }),
    }),
  grid: () => Container({ width: 0, height: 0 }),
  gridXLine: () => Container({ width: 1, height: Infinity, color: "#eeeeee" }),
  title: () => Container({ width: 0, height: 0 }),
  legend: ({ name }, ctx) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666", fontFamily: ctx.config.font.family }),
    }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<GanttChartConfig>): GanttChartConfig =>
    deepMerge(defaultToastConfig, config),
};

function createDependencyGeometry({
  fromIndex,
  toIndex,
  fromRatio,
  toRatio,
  width,
  rowHeight,
  barHeight,
}: {
  fromIndex: number;
  toIndex: number;
  fromRatio: number;
  toRatio: number;
  width: number;
  rowHeight: number;
  barHeight: number;
}) {
  const startX = width * fromRatio + 4;
  const targetX = width * toRatio;
  const endX = Math.max(startX + 18, targetX - 4);
  const startY = fromIndex * rowHeight + (rowHeight - 4 - barHeight) / 2 + barHeight / 2;
  const endY = toIndex * rowHeight + (rowHeight - 4 - barHeight) / 2 + barHeight / 2;
  const elbowX = startX + Math.max(12, Math.min(28, Math.abs(endX - startX) * 0.35));

  return {
    points: [
      { x: startX, y: startY },
      { x: elbowX, y: startY },
      { x: elbowX, y: endY },
      { x: endX, y: endY },
    ],
  };
}

function createDependencySegments(args: Parameters<typeof createDependencyGeometry>[0]) {
  return createDependencyGeometry(args).points;
}

function createDependencyPath(points: Array<{ x: number; y: number }>) {
  const path = new Path();
  const [first, ...rest] = points;
  path.moveTo(first);
  rest.forEach((point) => path.lineTo(point));
  return path;
}

function isPointNearDependency(
  position: { x: number; y: number },
  points: Array<{ x: number; y: number }>,
  tolerance = 6,
) {
  for (let index = 0; index < points.length - 1; index += 1) {
    if (distanceToSegment(position, points[index], points[index + 1]) <= tolerance) {
      return true;
    }
  }
  return false;
}

function distanceToSegment(
  point: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)),
  );
  const projectedX = start.x + t * dx;
  const projectedY = start.y + t * dy;
  return Math.hypot(point.x - projectedX, point.y - projectedY);
}
