import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
} from "flitter-core";
import { BubbleChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
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
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.layout(
      {
        title: new Title(),
        legends: ctx.legends.map(
          (name, index) => new Legend({ name, index }),
        ),
        plot: new Plot(),
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
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        series: new Series(),
        grid: new Grid(),
        axisCorner: new AxisCorner(),
      },
      ctx,
    );
  }
}

class XAxis extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    const { scale } = ctx;
    if (scale == null) {
      const axis = ctx.custom.xAxis({ labels: [], tick: new XAxisTick(), line: new XAxisLine() }, ctx);
      return ctx.custom.xAxisBox({ child: axis }, ctx);
    }

    const xSteps = (scale.x.max - scale.x.min) / scale.x.step;
    const labels = [];
    for (let i = 0; i <= xSteps; i++) {
      labels.push(scale.x.min + i * scale.x.step);
    }

    const axis = ctx.custom.xAxis(
      {
        labels: labels.map((name, index) => new XAxisLabel({ name: `${name}`, index })),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      ctx,
    );
    return ctx.custom.xAxisBox({ child: axis }, ctx);
  }
}

class YAxis extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    const { scale } = ctx;
    if (scale == null) {
      const axis = ctx.custom.yAxis({ labels: [], tick: new YAxisTick(), line: new YAxisLine() }, ctx);
      return ctx.custom.yAxisBox({ child: axis }, ctx);
    }

    const ySteps = (scale.y.max - scale.y.min) / scale.y.step;
    const labels = [];
    for (let i = 0; i <= ySteps; i++) {
      labels.push(scale.y.min + i * scale.y.step);
    }

    const axis = ctx.custom.yAxis(
      {
        labels: labels.map((name, index) => new YAxisLabel({ name: `${name}`, index })),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      ctx,
    );
    return ctx.custom.yAxisBox({ child: axis }, ctx);
  }
}

abstract class Label extends StatelessWidget {
  protected name: string;
  protected index: number;

  constructor({ name, index }: { name: string; index: number }) {
    super();
    this.name = name;
    this.index = index;
  }
}

class XAxisLabel extends Label {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.xAxisLabel({ name: this.name, index: this.index }, ctx);
  }
}

class YAxisLabel extends Label {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.name, index: this.index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.yAxisTick(undefined, ctx);
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.yAxisLine(undefined, ctx);
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    const { data, scale } = ctx;
    if (scale == null) return ctx.custom.series({ points: [], scale: { x: { min: 0, max: 0, step: 1 }, y: { min: 0, max: 0, step: 1 }, value: { min: 0, max: 0, step: 1 } } }, ctx);

    const points = data.datasets.flatMap((dataset, datasetIndex) =>
      dataset.data.map((pt) => ({
        ...pt,
        legend: dataset.legend,
        index: datasetIndex,
      })),
    );

    return ctx.custom.series({ points, scale }, ctx);
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BubbleChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
