import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { StyleConfig } from "../../plugin";
import type { ToastStackedAreaChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { createToastArea } from "./parts/area";
import {
  Row,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  Padding,
  MainAxisSize,
  Container,
  BoxDecoration,
  BorderRadius,
  type Widget,
} from "flitter-core";
import {
  toastLayout,
  toastTitle,
  toastAxisCorner,
  toastXAxisLabel,
  toastYAxisLabel,
  toastXAxisTick,
  toastYAxisTick,
  toastXAxisLine,
  toastYAxisLine,
  toastGridXLine,
  toastGridYLine,
  toastXAxis,
  toastYAxis,
} from "@shared/toast";

export { type ToastStackedAreaChartConfig } from "./config";

const createToastCustom = (
  config: ToastStackedAreaChartConfig,
): Partial<StackedAreaChartCustom> => ({
  layout: (args) => toastLayout(args, { config }),
  area: createToastArea(config),
  legend: ({ name, index }) => {
    const { colors, font } = config;
    const color = colors[index % colors.length];

    return Padding({
      padding: EdgeInsets.symmetric({ horizontal: 8 }),
      child: Row({
        mainAxisSize: MainAxisSize.min,
        children: [
          Container({
            width: 12,
            height: 12,
            decoration: new BoxDecoration({
              color,
              borderRadius: BorderRadius.circular(2),
            }),
          }),
          SizedBox({ width: 6 }),
          Text(name, {
            style: new TextStyle({
              fontFamily: font.family,
              fontSize: font.size,
              color: "#333333",
            }),
          }),
        ],
      }),
    });
  },
  title: ({ name }) => toastTitle({ name }, { config }),
  axisCorner: (_args) => toastAxisCorner(_args, { config }),
  xAxisLabel: (args) => toastXAxisLabel(args, { config }),
  yAxisLabel: (args) => toastYAxisLabel(args, { config }),
  xAxisTick: (_args) => toastXAxisTick(_args, { config }),
  yAxisTick: (_args) => toastYAxisTick(_args, { config }),
  xAxisLine: (_args) => toastXAxisLine(_args, { config }),
  yAxisLine: (_args) => toastYAxisLine(_args, { config }),
  gridXLine: (_args) => toastGridXLine(_args, { config }),
  gridYLine: (_args) => toastGridYLine(_args, { config }),
  xAxis: ({ line, labels, tick }) =>
    toastXAxis({ line, labels, tick }, { type: "label" }, { config }),
  yAxis: ({ line, labels, tick }) =>
    toastYAxis({ line, labels, tick }, { type: "value" }, { config }),
});

export const toastStyleConfig: StyleConfig<ToastStackedAreaChartConfig> = {
  custom: createToastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
};
