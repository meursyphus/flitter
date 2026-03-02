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
  Row,
  Column,
  Text,
  TextStyle,
  MainAxisSize,
  CrossAxisAlignment,
  BorderRadius,
  Radius,
  type Widget,
  type TooltipPosition,
  Rect,
} from "flitter-core";
import type { LineChartCustom, LineChartScale } from "@headless/line-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";

// --- Tooltip layout ---

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 120;
const DOT_SIZE = 10;

type TooltipLayout = {
  position: TooltipPosition;
  offset: Offset;
  translation: Offset;
  padding: EdgeInsets;
};

function computeColumnTooltipLayout({
  pointX,
  plotWidth,
  plotHeight,
}: {
  pointX: number;
  plotWidth: number;
  plotHeight: number;
}): TooltipLayout {
  const fitsRight = plotWidth - pointX >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
  const fitsTop = plotHeight / 2 >= ESTIMATED_TOOLTIP_HEIGHT;

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

// --- Multi-series tooltip content ---

type SeriesItem = {
  legend: string;
  color: string;
  value: number;
};

function multiSeriesTooltipContent({
  label,
  items,
  config,
}: {
  label: string;
  items: SeriesItem[];
  config: ToastStackedAreaChartConfig;
}): Widget {
  const { tooltip, font } = config;

  const rows: Widget[] = items.map((item) =>
    Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        Container({
          width: 12,
          height: 12,
          decoration: new BoxDecoration({
            color: item.color,
            borderRadius: BorderRadius.all(Radius.circular(2)),
          }),
        }),
        SizedBox({ width: 10 }),
        Text(item.legend, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ width: 16 }),
        Text(`${item.value}`, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 12,
            fontWeight: "bold",
            color: tooltip.textColor,
          }),
        }),
      ],
    }),
  );

  return Container({
    padding: EdgeInsets.symmetric({
      horizontal: tooltip.padding + 2,
      vertical: tooltip.padding,
    }),
    decoration: new BoxDecoration({
      color: tooltip.backgroundColor,
      borderRadius:
        tooltip.borderRadius > 0
          ? BorderRadius.all(Radius.circular(tooltip.borderRadius))
          : undefined,
      boxShadow: [
        new BoxShadow({
          color: "rgba(0,0,0,0.2)",
          blurRadius: 16,
        }),
      ],
    }),
    child: Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: 13,
            fontWeight: "bold",
            color: tooltip.textColor,
          }),
        }),
        SizedBox({ height: 14 }),
        ...rows,
      ],
    }),
  });
}

// --- Point info for stacked area ---

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
  config: ToastStackedAreaChartConfig;

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
    config: ToastStackedAreaChartConfig;
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
  hovered = false;
  tooltipLayout: TooltipLayout | null = null;

  override build(): Widget {
    const { points, label, colLeft, colWidth, plotWidth, plotHeight, pointX, config } =
      this.widget;

    const dotLocalX = pointX - colLeft;

    const children: Widget[] = [];

    // Full-height GestureDetector for hit detection
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
          onMouseEnter: () => {
            this.tooltipLayout = computeColumnTooltipLayout({
              pointX,
              plotWidth,
              plotHeight,
            });
            this.setState(() => {
              this.hovered = true;
            });
          },
          onMouseLeave: () => {
            this.setState(() => {
              this.hovered = false;
            });
          },
        }),
      }),
    );

    if (this.hovered && points.length > 0) {
      const layout = this.tooltipLayout;

      // Vertical line
      children.push(
        Positioned({
          key: "__vline__",
          left: dotLocalX,
          top: 0,
          bottom: 0,
          child: Container({
            width: 1,
            decoration: new BoxDecoration({
              color: "rgba(0,0,0,0.15)",
            }),
          }),
        }),
      );

      // Dots for ALL points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        children.push(
          Positioned({
            key: `__dot_${i}__`,
            left: dotLocalX - DOT_SIZE / 2,
            top: p.y - DOT_SIZE / 2,
            child: Container({
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
            }),
          }),
        );
      }

      // Tooltip anchored to the middle of the plot height
      const anchorY = plotHeight / 2;
      const tooltipWidget = ZIndex({
        zIndex: 9999,
        child: Padding({
          padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
          child: multiSeriesTooltipContent({
            label,
            items: points.map((p) => ({
              legend: p.legend,
              color: p.color,
              value: p.value,
            })),
            config,
          }),
        }),
      });

      children.push(
        Positioned({
          key: "__tooltip__",
          left: dotLocalX - DOT_SIZE / 2,
          top: anchorY - DOT_SIZE / 2,
          child: Stack({
            fit: StackFit.passthrough,
            clipped: false,
            children: [
              SizedBox({ width: DOT_SIZE, height: DOT_SIZE }),
              Positioned.fill({
                child: FractionalTranslation({
                  translation: layout?.offset ?? Offset.Constants.zero,
                  child: ConstraintsTransformBox({
                    constraintsTransform: ConstraintsTransformBox.unconstrained,
                    alignment: Alignment[layout?.position ?? "topRight"],
                    child: FractionalTranslation({
                      translation:
                        layout?.translation ?? new Offset({ x: 1, y: 0 }),
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

// --- Hover overlay ---

class _HoverOverlay extends StatelessWidget {
  datasets: { legend: string; values: number[] }[];
  labels: string[];
  scale: LineChartScale;
  colors: string[];
  legends: string[];
  config: ToastStackedAreaChartConfig;

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
    config: ToastStackedAreaChartConfig;
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
        const { scale } = this;
        const range = scale.max - scale.min;

        if (numLabels === 0) return SizedBox.expand();

        // Build cumulative values for stacking
        const numPoints = this.datasets[0]?.values.length ?? 0;
        const cumulativeByDataset: number[][] = [];
        let prevCumulative: number[] = new Array(numPoints).fill(0);

        for (const dataset of this.datasets) {
          const cumulative = dataset.values.map(
            (value, i) => prevCumulative[i] + value,
          );
          cumulativeByDataset.push(cumulative);
          prevCumulative = cumulative;
        }

        const columns: Widget[] = [];

        for (let li = 0; li < numLabels; li++) {
          const pointX =
            numLabels > 1 ? (li * width) / (numLabels - 1) : width / 2;

          // Gather all dataset points at this label index using cumulative y
          const colPoints: ColumnPoint[] = [];
          for (let di = 0; di < this.datasets.length; di++) {
            const dataset = this.datasets[di];
            if (li >= dataset.values.length) continue;
            const value = dataset.values[li];
            const cumulativeValue = cumulativeByDataset[di][li];
            const legendIdx = this.legends.indexOf(dataset.legend);
            const color = this.colors[legendIdx % this.colors.length];
            const y =
              range > 0
                ? height - (height * (cumulativeValue - scale.min)) / range
                : height / 2;
            colPoints.push({ y, value, legend: dataset.legend, color });
          }

          // Column boundaries
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

// --- Mount reveal (existing) ---

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

// --- Toast series ---

export function toastSeries(
  ...[args, ctx]: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["series"]>
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

  // Add hover overlay if tooltip enabled
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
          colors,
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
