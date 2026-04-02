import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
  SizedBox,
  GestureDetector,
} from "flitter-core";
import { BarChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return LayoutBuilder({
      builder: (_ctx: BuildContext, constraints) => {
        ctx.setSize(constraints.maxWidth, constraints.maxHeight);
        return new Layout();
      },
    });
  }
}

export default Chart;

class Layout extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.layout(
      {
        title: new Title(),
        plot: new Plot(),
        legends: ctx.legends.map(
          (name, index) => new Legend({ name, index }),
        ),
      },
      ctx,
    );
  }
}

class Legend extends StatelessWidget {
  #name: string;
  #index: number;

  constructor({ name, index }: { name: string; index: number }) {
    super();
    this.#name = name;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const name = this.#name;
    const isVisible = ctx.isSeriesVisible(name);
    return GestureDetector({
      onClick: () => ctx.toggleSeries(name),
      child: ctx.custom.legend({ name, index: this.#index, isVisible }, ctx),
    });
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const { scale } = BarChartProvider.of(context);
    if (scale == null) return [];
    const { min, max, step } = scale;
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = BarChartProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    const { direction } = BarChartProvider.of(context);
    if (direction === "vertical") {
      return this.getCategoryLabels(context);
    } else {
      return this.getValueLabels(context);
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const labels = this.#getLabels(context);
    const axis = ctx.custom.xAxis(
      {
        labels: labels.map(
          (label, index) => new XAxisLabel({ index, name: label }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      ctx,
    );
    return axis;
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxis extends Axis {
  #getLabels(context: BuildContext): string[] {
    const { direction } = BarChartProvider.of(context);
    if (direction === "vertical") {
      return this.getValueLabels(context);
    } else {
      return this.getCategoryLabels(context);
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const axis = ctx.custom.yAxis(
      {
        labels: this.#getLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      ctx,
    );
    return axis;
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.yAxisLine(undefined, ctx);
  }
}

abstract class Label extends StatelessWidget {
  protected index: number;
  protected name: string;

  constructor({ index, name }: { index: number; name: string }) {
    super();
    this.index = index;
    this.name = name;
  }
}

class XAxisLabel extends Label {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.xAxisLabel({ name: this.name, index: this.index }, ctx);
  }
}

class YAxisLabel extends StatelessWidget {
  #index: number;
  #name: string;

  constructor({ index, name }: { index: number; name: string }) {
    super();
    this.#index = index;
    this.#name = name;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.yAxisTick(undefined, ctx);
  }
}

class BarGroup extends StatelessWidget {
  #values: number[];
  #index: number;

  constructor({ values, index }: { values: number[]; index: number }) {
    super();
    this.#values = values;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const { data } = ctx;
    if (ctx.scale == null) return SizedBox.shrink();

    const bars = this.#values.map((value, datasetIndex) => ({
      bar: new Bar({
        value,
        index: this.#index,
        legend: data.datasets[datasetIndex].legend,
        label: data.labels[this.#index],
      }),
      value,
      datasetIndex,
    }));

    return ctx.custom.barGroup(
      { bars, index: this.#index, label: data.labels[this.#index] },
      ctx,
    );
  }
}

class Bar extends StatelessWidget {
  #value: number;
  #index: number;
  #legend: string;
  #label: string;

  constructor({
    value,
    index,
    legend,
    label,
  }: {
    value: number;
    index: number;
    legend: string;
    label: string;
  }) {
    super();
    this.#value = value;
    this.#index = index;
    this.#legend = legend;
    this.#label = label;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const index = this.#index;
    const legend = this.#legend;
    const isHovered = ctx.isBarHovered(index, legend);
    return GestureDetector({
      cursor: "default",
      onMouseEnter: () => ctx.hoverBar(index, legend),
      onMouseLeave: () => ctx.unhoverBar(index, legend),
      child: ctx.custom.bar(
        {
          value: this.#value,
          index,
          legend,
          label: this.#label,
          isHovered,
        },
        ctx,
      ),
    });
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.plot(
      { xAxis: new XAxis(), yAxis: new YAxis(), dataView: new DataView(), grid: new Grid(), axisCorner: new AxisCorner(), tooltipArea: new TooltipOverlay() },
      ctx,
    );
  }
}

class DataView extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const { data } = ctx;

    return GestureDetector({
      behavior: "translucent",
      onMouseLeave: () => ctx.unhoverAllBars(),
      child: ctx.custom.dataView(
        {
          barGroups: Array.from(
            { length: data.labels.length },
            (_, index) =>
              new BarGroup({
                values: data.datasets.map(({ values }) => values[index]),
                index,
              }),
          ),
        },
        ctx,
      ),
    });
  }
}

class TooltipOverlay extends StatelessWidget {
  private computeBarRect(
    ctx: ReturnType<typeof BarChartProvider.of>,
    dvWidth: number,
    dvHeight: number,
  ): { index: number; legend: string; value: number; label: string; x: number; y: number; width: number; height: number } | null {
    const { hoveredBar, data, scale, direction } = ctx;
    if (hoveredBar == null || scale == null) return null;

    const { index, legend } = hoveredBar;
    const datasetIndex = data.datasets.findIndex((d) => d.legend === legend);
    if (datasetIndex < 0) return null;

    const value = data.datasets[datasetIndex].values[index] ?? 0;
    const label = data.labels[index] ?? "";
    const numGroups = data.labels.length;
    const numBars = data.datasets.length;
    const isVertical = direction === "vertical";
    const total = scale.max - scale.min;

    if (isVertical) {
      const groupWidth = dvWidth / numGroups;
      const barWidth = groupWidth / numBars;
      const x = index * groupWidth + datasetIndex * barWidth;

      const hasNegative = scale.min < 0;
      let y: number;
      let height: number;

      if (!hasNegative) {
        height = (value / total) * dvHeight;
        y = dvHeight - height;
      } else {
        const zeroY = (scale.max / total) * dvHeight;
        if (value >= 0) {
          height = (value / total) * dvHeight;
          y = zeroY - height;
        } else {
          height = (Math.abs(value) / total) * dvHeight;
          y = zeroY;
        }
      }

      return { index, legend, value, label, x, y, width: barWidth, height };
    } else {
      const groupHeight = dvHeight / numGroups;
      const barHeight = groupHeight / numBars;
      const y = index * groupHeight + datasetIndex * barHeight;

      const hasNegative = scale.min < 0;
      let x: number;
      let width: number;

      if (!hasNegative) {
        width = (value / total) * dvWidth;
        x = 0;
      } else {
        const zeroX = (Math.abs(scale.min) / total) * dvWidth;
        if (value >= 0) {
          width = (value / total) * dvWidth;
          x = zeroX;
        } else {
          width = (Math.abs(value) / total) * dvWidth;
          x = zeroX - width;
        }
      }

      return { index, legend, value, label, x, y, width, height: barHeight };
    }
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);

    return LayoutBuilder({
      builder: (_: BuildContext, constraints) => {
        const dvWidth = constraints.maxWidth;
        const dvHeight = constraints.maxHeight;

        let tooltip: Widget | null = null;
        let hoveredBarRect = this.computeBarRect(ctx, dvWidth, dvHeight);

        if (hoveredBarRect != null) {
          const legendIdx = ctx.legends.indexOf(hoveredBarRect.legend);
          const colors = ctx.config?.colors ?? [];
          const color = colors[legendIdx % colors.length] ?? "#888";
          tooltip = ctx.custom.tooltip(
            { label: hoveredBarRect.label, items: [{ legend: hoveredBarRect.legend, color, value: hoveredBarRect.value }] },
            ctx,
          );
        }

        return ctx.custom.tooltipArea(
          { tooltip, hoveredBar: hoveredBarRect },
          ctx,
        );
      },
    });
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
