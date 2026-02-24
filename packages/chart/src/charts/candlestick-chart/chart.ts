import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { CandlestickChartConfigProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new Layout();
  }
}

export default Chart;

class Layout extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new Title(),
        plot: new Plot(),
        legends: [],
      },
      config,
    );
  }
}

class Title extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

abstract class Axis extends StatelessWidget {
  protected getValueLabels(context: BuildContext): string[] {
    const {
      scale: { min, max, step },
    } = CandlestickChartConfigProvider.of(context);
    const labels = [];
    for (let i = 0; i <= (max - min) / step; i++) {
      labels.push(min + step * i);
    }
    return labels.map((label) => label.toString());
  }
  protected getCategoryLabels(context: BuildContext): string[] {
    const { data } = CandlestickChartConfigProvider.of(context);
    return data.labels;
  }
}

class XAxis extends Axis {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    const labels = this.getCategoryLabels(context);
    return custom.xAxis(
      {
        labels: labels.map(
          (label, index) => new XAxisLabel({ index, name: label }),
        ),
        tick: new XAxisTick(),
        line: new XAxisLine(),
      },
      config,
    );
  }
}

class XAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLine(undefined, config);
  }
}

class YAxis extends Axis {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxis(
      {
        labels: this.getValueLabels(context).map(
          (label, index) => new YAxisLabel({ index, name: label }),
        ),
        tick: new YAxisTick(),
        line: new YAxisLine(),
      },
      config,
    );
  }
}

class YAxisLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLine(undefined, config);
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
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisLabel({ name: this.#name, index: this.#index }, config);
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
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisLabel({ name: this.#name, index: this.#index }, config);
  }
}

class XAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.xAxisTick(undefined, config);
  }
}

class YAxisTick extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.yAxisTick(undefined, config);
  }
}

class Candlestick extends StatelessWidget {
  #index: number;

  constructor({ index }: { index: number }) {
    super();
    this.#index = index;
  }

  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom, data } = config;
    const point = data.datasets[this.#index];
    return custom.candlestick(
      {
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
        label: data.labels[this.#index],
        index: this.#index,
      },
      config,
    );
  }
}

class Plot extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.plot(
      {
        xAxis: new XAxis(),
        yAxis: new YAxis(),
        series: new Series(),
        grid: new Grid(),
      },
      config,
    );
  }
}

class Series extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom, data } = config;
    return custom.series(
      {
        candlesticks: Array.from({ length: data.datasets.length }, (_, index) =>
          new Candlestick({ index }),
        ),
      },
      config,
    );
  }
}

class Grid extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.grid(
      { xLine: new GridXLine(), yLine: new GridYLine() },
      config,
    );
  }
}

class GridXLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridXLine(undefined, config);
  }
}

class GridYLine extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = CandlestickChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gridYLine(undefined, config);
  }
}
