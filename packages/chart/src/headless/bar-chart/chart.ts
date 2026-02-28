import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
  Alignment,
  Axis as FlexAxis,
  Container,
  CrossAxisAlignment,
  Expanded,
  Flex,
  Flexible,
  MainAxisAlignment,
  SizedBox,
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
    return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.title({ name: ctx.title }, ctx);
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
    return ctx.custom.xAxis(
      {
        labels: labels.map(
          (label, index) => new XAxisLabel({ index, name: label }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      ctx,
    );
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
    return ctx.custom.yAxis(
      {
        labels: this.#getLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      ctx,
    );
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

class BarBox extends StatelessWidget {
  #bar: Widget;
  #value: number;
  #ratio: number;
  #alignment: Alignment;
  #index: number;

  constructor({
    bar,
    value,
    ratio,
    alignment,
    index,
  }: {
    bar: Widget;
    value: number;
    ratio: number;
    alignment: Alignment;
    index: number;
  }) {
    super();
    this.#bar = bar;
    this.#value = value;
    this.#ratio = ratio;
    this.#alignment = alignment;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    return ctx.custom.barBox(
      {
        bar: this.#bar,
        value: this.#value,
        ratio: this.#ratio,
        alignment: this.#alignment,
        index: this.#index,
      },
      ctx,
    );
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
    const { data, scale, direction } = ctx;
    if (scale == null) return SizedBox.shrink();

    const isVertical = direction === "vertical";
    const total = scale.max - scale.min;
    const hasNegative = scale.min < 0;

    const barChildren = this.#values.map((value, datasetIndex) => {
      const bar = new Bar({
        value,
        index: this.#index,
        legend: data.datasets[datasetIndex].legend,
        label: data.labels[this.#index],
      });

      if (!hasNegative) {
        const ratio = value / total;
        const alignment = isVertical
          ? Alignment.bottomCenter
          : Alignment.centerLeft;
        return Flexible({
          flex: 1,
          child: new BarBox({ bar, value, ratio, alignment, index: datasetIndex }),
        });
      }

      const positiveMax = scale.max;
      const negativeMax = Math.abs(scale.min);
      const isPositive = value >= 0;

      const ratio = isPositive
        ? value / positiveMax
        : Math.abs(value) / negativeMax;
      const alignment = isPositive
        ? isVertical
          ? Alignment.bottomCenter
          : Alignment.centerLeft
        : isVertical
          ? Alignment.topCenter
          : Alignment.centerRight;

      const barBox = new BarBox({
        bar,
        value,
        ratio,
        alignment,
        index: datasetIndex,
      });

      const positiveChild = isPositive ? barBox : SizedBox.shrink();
      const negativeChild = !isPositive ? barBox : SizedBox.shrink();

      if (isVertical) {
        return Flexible({
          flex: 1,
          child: Flex({
            direction: FlexAxis.vertical,
            children: [
              Expanded({ flex: positiveMax, child: positiveChild }),
              Expanded({ flex: negativeMax, child: negativeChild }),
            ],
          }),
        });
      } else {
        return Flexible({
          flex: 1,
          child: Flex({
            direction: FlexAxis.horizontal,
            children: [
              Expanded({ flex: negativeMax, child: negativeChild }),
              Expanded({ flex: positiveMax, child: positiveChild }),
            ],
          }),
        });
      }
    });

    const child = Container({
      width: Infinity,
      height: Infinity,
      child: Flex({
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: isVertical
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
        direction: isVertical ? FlexAxis.horizontal : FlexAxis.vertical,
        children: barChildren,
      }),
    });

    return ctx.custom.barGroup(
      {
        child,
        index: this.#index,
        label: data.labels[this.#index],
      },
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
    return ctx.custom.bar(
      {
        value: this.#value,
        index: this.#index,
        legend: this.#legend,
        label: this.#label,
      },
      ctx,
    );
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
      { xAxis: new XAxis(), yAxis: new YAxis(), series: new Series(), grid: new Grid(), axisCorner: new AxisCorner() },
      ctx,
    );
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BarChartProvider.of(context);
    const { data } = ctx;
    return ctx.custom.series(
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
    );
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
