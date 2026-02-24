// chart.ts
import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { HeatmapConfigProvider } from "./provider";

class HeatmapChart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default HeatmapChart;

class Layout extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        plot: new PlotWidget(),
      },
      config,
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

abstract class AxisBase extends StatelessWidget {
  protected getXLabels(context: BuildContext): Widget[] {
    const config = HeatmapConfigProvider.of(context);
    const { data, custom } = config;
    return data.xLabels.map((name, index) => new XAxisLabel({ name, index }));
  }

  protected getYLabels(context: BuildContext): Widget[] {
    const config = HeatmapConfigProvider.of(context);
    const { data, custom } = config;
    return data.yLabels.map((name, index) => new YAxisLabel({ name, index }));
  }
}

class XAxis extends AxisBase {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxis(
      {
        line: new XAxisLine(),
        labels: this.getXLabels(context),
        tick: new XAxisTick(),
      },
      config,
    );
  }
}

class YAxis extends AxisBase {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxis(
      {
        line: new YAxisLine(),
        labels: this.getYLabels(context),
        tick: new YAxisTick(),
      },
      config,
    );
  }
}

class XAxisLabel extends StatelessWidget {
  #name: string;
  #index: number;

  constructor({ name, index }: { name: string; index: number }) {
    super();
    this.#name = name;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLabel({ name: this.#name, index: this.#index }, config);
  }
}

class YAxisLabel extends StatelessWidget {
  #name: string;
  #index: number;

  constructor({ name, index }: { name: string; index: number }) {
    super();
    this.#name = name;
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLabel({ name: this.#name, index: this.#index }, config);
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLine(undefined, config);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisTick(undefined, config);
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLine(undefined, config);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisTick(undefined, config);
  }
}

class PlotWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        heatmap: new HeatmapWidget(),
      },
      config,
    );
  }
}

class HeatmapWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom, data } = config;
    // data.values: number[yIndex][xIndex]
    // segments: Widget[][] 형태로 변환
    const segments: Widget[][] = data.values.map((row, yIndex) =>
      row.map((value, xIndex) => new SegmentWidget({ value, xIndex, yIndex })),
    );

    return custom.heatmap({ segments }, config);
  }
}

class SegmentWidget extends StatelessWidget {
  #value: number;
  #xIndex: number;
  #yIndex: number;

  constructor({
    value,
    xIndex,
    yIndex,
  }: {
    value: number;
    xIndex: number;
    yIndex: number;
  }) {
    super();
    this.#value = value;
    this.#xIndex = xIndex;
    this.#yIndex = yIndex;
  }

  override build(context: BuildContext): Widget {
    const config = HeatmapConfigProvider.of(context);
    const { custom } = config;
    return custom.segment(
      { value: this.#value, xIndex: this.#xIndex, yIndex: this.#yIndex },
      config,
    );
  }
}
