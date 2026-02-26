import {
  type Widget,
  StatefulWidget,
  type BuildContext,
} from "flitter-core";
import { State } from "flitter-core";
import type { BarChartCustom, BarChartData, BarChartScale } from "./types";
import { BarChartConfigProvider } from "./provider";
import { BarChartController } from "./controller";
import * as Default from "./default";
import Chart from "./chart";

class _BarChart<TConfig = {}> extends StatefulWidget {
  custom: BarChartCustom<TConfig>;
  data: BarChartData;
  getScale: (data: BarChartData) => BarChartScale;
  title: string;
  direction: "vertical" | "horizontal";
  userConfig: TConfig;

  constructor({
    custom = {},
    getScale = Default.getScale,
    data,
    title = "",
    direction = "vertical",
    config = {} as TConfig,
  }: {
    custom?: Partial<BarChartCustom<TConfig>>;
    title?: string;
    data: BarChartData;
    direction?: "vertical" | "horizontal";
    getScale?: (data: BarChartData) => BarChartScale;
    config?: TConfig;
  }) {
    super();
    this.data = data;
    this.getScale = getScale;
    this.title = title;
    this.direction = direction;
    this.userConfig = config;
    const defaults = {
      barGroup: Default.BarGroup,
      bar: Default.Bar,
      xAxis: Default.XAxis,
      xAxisLabel: Default.XAxisLabel,
      xAxisTick: Default.XAxisTick,
      xAxisLine: Default.XAxisLine,
      yAxis: Default.YAxis,
      yAxisLabel: Default.YAxisLabel,
      yAxisTick: Default.YAxisTick,
      yAxisLine: Default.YAxisLine,
      series: Default.Series,
      layout: Default.Layout,
      plot: Default.Plot,
      legend: Default.Legend,
      title: Default.Title,
      dataLabel: Default.DataLabel,
      grid: Default.Grid,
      gridXLine: Default.GridXLine,
      gridYLine: Default.GridYLine,
      axisCorner: Default.AxisCorner,
    };
    this.custom = { ...defaults, ...custom } as BarChartCustom<TConfig>;
  }

  override createState() {
    return new _BarChartState<TConfig>();
  }
}

class _BarChartState<TConfig = {}> extends State<_BarChart<TConfig>> {
  controller!: BarChartController;

  override initState(_context: BuildContext): void {
    super.initState(_context);
    this.controller = new BarChartController({
      data: this.widget.data,
      getScale: this.widget.getScale,
    });
    this.controller.addListener(() => {
      this.setState();
    });
  }

  override didUpdateWidget(oldWidget: _BarChart<TConfig>): void {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.data !== this.widget.data) {
      this.controller.data = this.widget.data;
    }
  }

  override build(_context: BuildContext): Widget {
    const scale = this.widget.getScale(this.widget.data);

    return BarChartConfigProvider({
      value: {
        custom: this.widget.custom,
        data: this.widget.data,
        scale,
        title: this.widget.title,
        direction: this.widget.direction,
        config: this.widget.userConfig,
        controller: this.controller,
      },
      child: new Chart(),
    });
  }
}

export default function BarChart<TConfig = {}>(props: {
  custom?: Partial<BarChartCustom<TConfig>>;
  title?: string;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: (data: BarChartData) => BarChartScale;
  config?: TConfig;
}): Widget {
  return new _BarChart(props);
}
