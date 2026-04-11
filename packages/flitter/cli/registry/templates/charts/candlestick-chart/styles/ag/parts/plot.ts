import {
  Alignment,
  Column,
  Container,
  CrossAxisAlignment,
  Expanded,
  GlobalKey,
  Row,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  type BuildContext,
  type Widget,
} from "flitter-core";

class _AgCandlestickPlot extends StatefulWidget {
  axisCorner: Widget;
  dataView: Widget;
  grid: Widget;
  tooltipArea: Widget;
  xAxis: Widget;
  yAxis: Widget;

  constructor({
    axisCorner,
    dataView,
    grid,
    tooltipArea,
    xAxis,
    yAxis,
  }: {
    axisCorner: Widget;
    dataView: Widget;
    grid: Widget;
    tooltipArea: Widget;
    xAxis: Widget;
    yAxis: Widget;
  }) {
    super();
    this.axisCorner = axisCorner;
    this.dataView = dataView;
    this.grid = grid;
    this.tooltipArea = tooltipArea;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  createState() {
    return new _AgCandlestickPlotState();
  }
}

class _AgCandlestickPlotState extends State<_AgCandlestickPlot> {
  yAxisKey = new GlobalKey();
  measuredYAxisWidth = 0;
  scheduledMeasurement = false;

  private scheduleYAxisMeasurement(): void {
    if (this.scheduledMeasurement) return;
    this.scheduledMeasurement = true;
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.scheduledMeasurement = false;

      const yAxisRenderObject = this.yAxisKey.currentContext?.renderObject;
      if (yAxisRenderObject == null) return;

      const nextWidth = yAxisRenderObject.size.width;
      if (nextWidth === this.measuredYAxisWidth) return;

      this.setState(() => {
        this.measuredYAxisWidth = nextWidth;
      });
    });
  }

  override build(_context: BuildContext): Widget {
    this.scheduleYAxisMeasurement();

    return Column({
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Expanded({
          child: Row({
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded({
                child: Stack({
                  fit: StackFit.expand,
                  clipped: false,
                  children: [
                    this.widget.grid,
                    this.widget.dataView,
                    this.widget.tooltipArea,
                  ],
                }),
              }),
              Container({
                key: this.yAxisKey,
                child: this.widget.yAxis,
              }),
            ],
          }),
        }),
        Row({
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded({
              child: this.widget.xAxis,
            }),
            Container({
              width: this.measuredYAxisWidth,
              alignment: Alignment.topLeft,
              child: this.widget.axisCorner,
            }),
          ],
        }),
      ],
    });
  }
}

export function agCandlestickPlot({
  axisCorner,
  dataView,
  grid,
  tooltipArea,
  xAxis,
  yAxis,
}: {
  axisCorner: Widget;
  dataView: Widget;
  grid: Widget;
  tooltipArea: Widget;
  xAxis: Widget;
  yAxis: Widget;
}): Widget {
  return new _AgCandlestickPlot({
    axisCorner,
    dataView,
    grid,
    tooltipArea,
    xAxis,
    yAxis,
  });
}
