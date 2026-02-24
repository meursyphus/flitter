import {
  StatelessWidget,
  type Widget,
  type BuildContext,
} from "flitter-core";
import { GaugeChartConfigProvider } from "./provider";

class GaugeChart extends StatelessWidget {
  override build(_: BuildContext): Widget {
    return new LayoutWidget();
  }
}

export default GaugeChart;

class LayoutWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = GaugeChartConfigProvider.of(context);
    const { custom } = config;
    return custom.layout(
      {
        title: new TitleWidget(),
        gauge: new GaugeWidget(),
        valueLabel: new ValueLabelWidget(),
      },
      config,
    );
  }
}

class TitleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = GaugeChartConfigProvider.of(context);
    const { custom, title } = config;
    return custom.title({ name: title }, config);
  }
}

class GaugeWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = GaugeChartConfigProvider.of(context);
    const { custom } = config;
    return custom.gauge(
      {
        needle: new NeedleWidget(),
        scale: new ScaleWidget(),
      },
      config,
    );
  }
}

class NeedleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = GaugeChartConfigProvider.of(context);
    const { custom, value, min, max } = config;
    const ratio = (value - min) / (max - min);
    return custom.needle({ value, ratio }, config);
  }
}

class ValueLabelWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = GaugeChartConfigProvider.of(context);
    const { custom, value, min, max } = config;
    return custom.valueLabel({ value, min, max }, config);
  }
}

class ScaleWidget extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const config = GaugeChartConfigProvider.of(context);
    const { custom, min, max, zones } = config;
    return custom.scale({ min, max, zones }, config);
  }
}
