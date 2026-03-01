import {
  StatefulWidget,
  State,
  StatelessWidget,
  AnimationController,
  CurvedAnimation,
  Curves,
  Tween,
  ClipRect,
  Stack,
  StackFit,
  Positioned,
  LayoutBuilder,
  SizedBox,
  Container,
  GestureDetector,
  ZIndex,
  Padding,
  FractionalTranslation,
  ConstraintsTransformBox,
  Alignment,
  BoxDecoration,
  Border,
  BoxShadow,
  EdgeInsets,
  Offset,
  type Widget,
  type TooltipPosition,
  Rect,
} from "flitter-core";
import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import type { AgAreaChartConfig } from "../config";
import { computeDataPointPosition } from "./area";
import { agTooltipContent } from "@shared/styles/ag";

// --- Tooltip layout ---

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;
const DOT_SIZE = 10;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

function computePointTooltipLayout({
  pointX,
  pointY,
  plotWidth,
  plotHeight,
}: {
  pointX: number;
  pointY: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
  const fitsRight = plotWidth - pointX >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = pointY >= ESTIMATED_TOOLTIP_HEIGHT;

  if (fitsRight) {
    return {
      position: fitsTop ? "bottomRight" : "topRight",
      translation: new Offset({ x: 1, y: 0 }),
      offset: Offset.Constants.zero,
      padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
    };
  }
  return {
    position: fitsTop ? "bottomLeft" : "topLeft",
    translation: new Offset({ x: -1, y: 0 }),
    offset: Offset.Constants.zero,
    padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
  };
}

// --- Point info for a single x-column ---

type ColumnPoint = {
  y: number;
  value: number;
  legend: string;
  color: string;
};

// --- HoverableColumn: one vertical strip per label index ---

class _HoverableColumn extends StatefulWidget {
  points: ColumnPoint[];
  label: string;
  colLeft: number;
  colWidth: number;
  plotWidth: number;
  plotHeight: number;
  pointX: number;
  config: AgAreaChartConfig;

  constructor({
    key,
    points,
    label,
    colLeft,
    colWidth,
    plotWidth,
    plotHeight,
    pointX,
    config,
  }: {
    key: string;
    points: ColumnPoint[];
    label: string;
    colLeft: number;
    colWidth: number;
    plotWidth: number;
    plotHeight: number;
    pointX: number;
    config: AgAreaChartConfig;
  }) {
    super(key);
    this.points = points;
    this.label = label;
    this.colLeft = colLeft;
    this.colWidth = colWidth;
    this.plotWidth = plotWidth;
    this.plotHeight = plotHeight;
    this.pointX = pointX;
    this.config = config;
  }

  createState() {
    return new _HoverableColumnState();
  }
}

class _HoverableColumnState extends State<_HoverableColumn> {
  hoveredIndex: number | null = null;
  tooltipLayout: TooltipLayout | null = null;

  private findNearestIndex(mouseY: number): number {
    const { points } = this.widget;
    let bestIdx = 0;
    let bestDist = Math.abs(mouseY - points[0].y);
    for (let i = 1; i < points.length; i++) {
      const dist = Math.abs(mouseY - points[i].y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  private findPlotGlobal(): { x: number; y: number } | null {
    const { plotWidth, plotHeight } = this.widget;
    let node = this.element.renderObject.parent;
    while (node) {
      const s = node.size;
      if (
        s &&
        Math.abs(s.width - plotWidth) < 1 &&
        Math.abs(s.height - plotHeight) < 1
      ) {
        return node.localToGlobal();
      }
      node = node.parent;
    }
    return null;
  }

  private computeMouseY(e: MouseEvent): number | null {
    const plotGlobal = this.findPlotGlobal();
    if (!plotGlobal) return null;
    const renderObject = this.element.renderObject;
    const viewPort = renderObject.renderOwner.renderContext.viewPort;
    const { translation, scale } = viewPort;
    const view = renderObject.renderOwner.renderContext.view;
    const rect = view.getBoundingClientRect();
    const flitterY = (e.clientY - rect.top) / scale - translation.y;
    return flitterY - plotGlobal.y;
  }

  private handleHover(e: MouseEvent) {
    const { points, plotWidth, plotHeight, pointX } = this.widget;
    if (points.length === 0) return;
    const mouseY = this.computeMouseY(e);
    if (mouseY == null) return;

    const idx = this.findNearestIndex(mouseY);
    if (idx === this.hoveredIndex) return;

    this.tooltipLayout = computePointTooltipLayout({
      pointX,
      pointY: points[idx].y,
      plotWidth,
      plotHeight,
    });
    this.setState(() => {
      this.hoveredIndex = idx;
    });
  }

  override build(): Widget {
    const { points, label, colLeft, colWidth, plotWidth, plotHeight, pointX, config } = this.widget;
    const hi = this.hoveredIndex;

    const dotLocalX = pointX - colLeft;

    const children: Widget[] = [];

    // Full-height GestureDetector for this column
    children.push(
      Positioned({
        key: "__hit__",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        child: GestureDetector({
          cursor: "default",
          child: SizedBox.expand(),
          onMouseMove: (e: MouseEvent) => this.handleHover(e),
          onMouseEnter: (e: MouseEvent) => this.handleHover(e),
          onMouseLeave: () => {
            this.setState(() => {
              this.hoveredIndex = null;
            });
          },
        }),
      }),
    );

    // Show dot + tooltip for hovered point
    if (hi != null && hi >= 0 && hi < points.length) {
      const p = points[hi];
      const layout = this.tooltipLayout;

      const dot = Container({
        width: DOT_SIZE,
        height: DOT_SIZE,
        decoration: new BoxDecoration({
          color: p.color,
          shape: "circle",
          border: Border.all({ color: "white", width: 2, strokeAlign: 1 }),
          boxShadow: [
            new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 6 }),
          ],
        }),
      });

      const tooltipWidget = ZIndex({
        zIndex: 9999,
        child: Padding({
          padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
          child: agTooltipContent({
            label,
            legend: p.legend,
            color: p.color,
            value: p.value,
            config,
          }),
        }),
      });

      children.push(
        Positioned({
          key: "__dot__",
          left: dotLocalX - DOT_SIZE / 2,
          top: p.y - DOT_SIZE / 2,
          child: Stack({
            fit: StackFit.passthrough,
            clipped: false,
            children: [
              dot,
              Positioned.fill({
                child: FractionalTranslation({
                  translation: layout?.offset ?? Offset.Constants.zero,
                  child: ConstraintsTransformBox({
                    constraintsTransform: ConstraintsTransformBox.unconstrained,
                    alignment: Alignment[layout?.position ?? "topRight"],
                    child: FractionalTranslation({
                      translation: layout?.translation ?? new Offset({ x: 1, y: 0 }),
                      child: tooltipWidget,
                    }),
                  }),
                }),
              }),
            ],
          }),
        }),
      );
    }

    return Stack({
      clipped: false,
      children,
    });
  }
}

// --- Hover overlay: row of columns ---

class _HoverOverlay extends StatelessWidget {
  datasets: { legend: string; values: number[] }[];
  labels: string[];
  scale: LineChartScale;
  colors: string[];
  legends: string[];
  config: AgAreaChartConfig;

  constructor({
    datasets,
    labels,
    scale,
    colors,
    legends,
    config,
  }: {
    datasets: { legend: string; values: number[] }[];
    labels: string[];
    scale: LineChartScale;
    colors: string[];
    legends: string[];
    config: AgAreaChartConfig;
  }) {
    super();
    this.datasets = datasets;
    this.labels = labels;
    this.scale = scale;
    this.colors = colors;
    this.legends = legends;
    this.config = config;
  }

  override build(): Widget {
    return LayoutBuilder({
      builder: (_ctx, constraints) => {
        const width = constraints.maxWidth;
        const height = constraints.maxHeight;
        const numLabels = this.labels.length;

        if (numLabels === 0) return SizedBox.expand();

        const columns: Widget[] = [];

        for (let li = 0; li < numLabels; li++) {
          const pointX = numLabels > 1 ? (li * width) / (numLabels - 1) : width / 2;

          const colPoints: ColumnPoint[] = [];
          for (const dataset of this.datasets) {
            if (li >= dataset.values.length) continue;
            const value = dataset.values[li];
            const legendIdx = this.legends.indexOf(dataset.legend);
            const color = this.colors[legendIdx % this.colors.length];
            const pos = computeDataPointPosition({
              index: li,
              value,
              numPoints: dataset.values.length,
              scale: this.scale,
              width,
              height,
            });
            colPoints.push({ y: pos.y, value, legend: dataset.legend, color });
          }

          let colLeft: number;
          let colRight: number;
          if (numLabels <= 1) {
            colLeft = 0;
            colRight = width;
          } else {
            const step = width / (numLabels - 1);
            colLeft = li === 0 ? 0 : pointX - step / 2;
            colRight = li === numLabels - 1 ? width : pointX + step / 2;
          }

          columns.push(
            Positioned({
              key: `col-${li}`,
              left: colLeft,
              top: 0,
              bottom: 0,
              width: colRight - colLeft,
              child: new _HoverableColumn({
                key: `col-${li}`,
                points: colPoints,
                label: this.labels[li] ?? `${li}`,
                colLeft,
                colWidth: colRight - colLeft,
                plotWidth: width,
                plotHeight: height,
                pointX,
                config: this.config,
              }),
            }),
          );
        }

        return Stack({ children: columns });
      },
    });
  }
}

// --- Mount reveal ---

class _MountReveal extends StatefulWidget {
  child: Widget;
  duration: number;

  constructor({ child, duration }: { child: Widget; duration: number }) {
    super();
    this.child = child;
    this.duration = duration;
  }

  createState() {
    return new _MountRevealState();
  }
}

class _MountRevealState extends State<_MountReveal> {
  controller!: AnimationController;
  tween!: { value: number };

  override initState() {
    this.controller = new AnimationController({ duration: this.widget.duration });
    this.controller.addListener(() => this.setState());
    this.tween = new Tween({ begin: 0, end: 1 }).animated(
      new CurvedAnimation({ parent: this.controller, curve: Curves.easeInOut }),
    );
    this.controller.forward();
  }

  override dispose() {
    this.controller.dispose();
  }

  override build() {
    const t = this.tween.value;
    return ClipRect({
      clipped: t < 1,
      clipper: (size) =>
        Rect.fromLTRB({
          left: 0,
          top: 0,
          right: size.width * t,
          bottom: size.height,
        }),
      child: this.widget.child,
    });
  }
}

// --- AG series ---

export function agSeries(
  ...[args, ctx]: Parameters<LineChartCustom<AgAreaChartConfig>["series"]>
) {
  const { lines } = args;
  const datasets = ctx.data.datasets;
  const { animation, tooltip, colors } = ctx.config;
  const scale = ctx.scale;

  const children: Widget[] = lines.map((line, i) =>
    Positioned({
      key: datasets[i]?.legend ?? i,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      child: line,
    }),
  );

  if (tooltip.enabled && scale != null) {
    children.push(
      Positioned({
        key: "__hover_overlay__",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        child: new _HoverOverlay({
          datasets,
          labels: ctx.data.labels,
          scale,
          colors: colors.fills,
          legends: ctx.legends,
          config: ctx.config,
        }),
      }),
    );
  }

  const stack = Stack({ children });

  if (!animation.enabled) return stack;

  return new _MountReveal({
    child: stack,
    duration: animation.duration,
  });
}
