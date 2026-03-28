import {
  StatelessWidget,
  type Widget,
  type BuildContext,
  LayoutBuilder,
  SizedBox,
  Stack,
} from "flitter-core";
import { BulletChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new SizeTracker();
  }
}

class SizeTracker extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
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
    const ctx = BulletChartProvider.of(context);
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
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.title(undefined, ctx);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const { scale } = BulletChartProvider.of(context);
    if (scale == null) return [];
    const { min, max, step } = scale;
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = BulletChartProvider.of(context);
    return data.labels;
  }
}

// Bullet chart is always horizontal: X = value axis, Y = category axis
class XAxis extends Axis {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    const labels = this.getValueLabels(context);
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
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.xAxisLine(undefined, ctx);
  }
}

class YAxis extends Axis {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    const labels = this.getCategoryLabels(context);
    return ctx.custom.yAxis(
      {
        labels: labels.map(
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
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.yAxisLine(undefined, ctx);
  }
}

class XAxisLabel extends StatelessWidget {
  #index: number;
  #name: string;

  constructor({ index, name }: { index: number; name: string }) {
    super();
    this.#index = index;
    this.#name = name;
  }

  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.xAxisLabel({ name: this.#name, index: this.#index }, ctx);
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
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.xAxisTick(undefined, ctx);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.yAxisTick(undefined, ctx);
  }
}

class BulletGroup extends StatelessWidget {
  #index: number;

  constructor({ index }: { index: number }) {
    super();
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    const { data } = ctx;
    if (ctx.scale == null) return SizedBox.shrink();

    const dataset = data.datasets[this.#index];
    const label = data.labels[this.#index];

    const ranges = Stack({
      children: dataset.ranges
        .slice()
        .sort((a, b) => b - a)
        .map((rangeValue, rangeIndex) =>
          new RangeBar({ rangeValue, rangeIndex, index: this.#index, label }),
        ),
    });

    return ctx.custom.bulletGroup(
      {
        ranges,
        valueBar: new ValueBar({ value: dataset.value, index: this.#index, label }),
        targetMarker: new TargetMarker({ target: dataset.target, index: this.#index, label }),
        index: this.#index,
        label,
      },
      ctx,
    );
  }
}

class RangeBar extends StatelessWidget {
  #rangeValue: number;
  #rangeIndex: number;
  #index: number;
  #label: string;

  constructor({ rangeValue, rangeIndex, index, label }: { rangeValue: number; rangeIndex: number; index: number; label: string }) {
    super();
    this.#rangeValue = rangeValue;
    this.#rangeIndex = rangeIndex;
    this.#index = index;
    this.#label = label;
  }

  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.rangeBar(
      { rangeValue: this.#rangeValue, rangeIndex: this.#rangeIndex, index: this.#index, label: this.#label },
      ctx,
    );
  }
}

class ValueBar extends StatelessWidget {
  #value: number;
  #index: number;
  #label: string;

  constructor({ value, index, label }: { value: number; index: number; label: string }) {
    super();
    this.#value = value;
    this.#index = index;
    this.#label = label;
  }

  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.valueBar(
      { value: this.#value, index: this.#index, label: this.#label },
      ctx,
    );
  }
}

class TargetMarker extends StatelessWidget {
  #target: number;
  #index: number;
  #label: string;

  constructor({ target, index, label }: { target: number; index: number; label: string }) {
    super();
    this.#target = target;
    this.#index = index;
    this.#label = label;
  }

  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.targetMarker(
      { target: this.#target, index: this.#index, label: this.#label },
      ctx,
    );
  }
}

class AxisCorner extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.axisCorner(undefined, ctx);
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.plot(
      { xAxis: new XAxis(), yAxis: new YAxis(), dataView: new DataView(), grid: new Grid(), axisCorner: new AxisCorner() },
      ctx,
    );
  }
}

class DataView extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    const { data } = ctx;
    return ctx.custom.dataView(
      {
        bulletGroups: Array.from(
          { length: data.labels.length },
          (_, index) => new BulletGroup({ index }),
        ),
      },
      ctx,
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      ctx,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.gridXLine(undefined, ctx);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = BulletChartProvider.of(context);
    return ctx.custom.gridYLine(undefined, ctx);
  }
}
