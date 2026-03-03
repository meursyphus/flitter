import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
} from "flitter-core";
import { LineChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
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
    const ctx = LineChartProvider.of(context);
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
    const ctx = LineChartProvider.of(context);
    return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const { scale } = LineChartProvider.of(context);
    if (scale == null) return [];
    const { min, max, step } = scale;
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = LineChartProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    const labels = this.getCategoryLabels(context);
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
    const ctx = LineChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxis extends Axis {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    const axis = ctx.custom.yAxis(
      {
        labels: this.getValueLabels(context).map(
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
    const ctx = LineChartProvider.of(context);
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
    const ctx = LineChartProvider.of(context);
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
    const ctx = LineChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.yAxisTick(undefined, ctx);
  }
}

class Line extends StatelessWidget {
  #values: number[];
  #index: number;
  #legend: string;

  constructor({
    values,
    index,
    legend,
  }: {
    values: number[];
    index: number;
    legend: string;
  }) {
    super();
    this.#values = values;
    this.#index = index;
    this.#legend = legend;
  }

  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.line(
      {
        values: this.#values,
        legend: this.#legend,
        index: this.#index,
      },
      ctx,
    );
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        dataView: new DataView(),
        grid: new Grid(),
        axisCorner: new AxisCorner(),
      },
      ctx,
    );
  }
}

class DataView extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    const { data } = ctx;
    return ctx.custom.dataView(
      {
        lines: data.datasets.map(
          (dataset, index) =>
            new Line({
              values: dataset.values,
              index,
              legend: dataset.legend,
            }),
        ),
      },
      ctx,
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = LineChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
