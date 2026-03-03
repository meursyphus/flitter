import type { Widget } from "flitter-core";
import type { HeatmapCustom, HeatmapData, HeatmapScale } from "./types";
import { HeatmapContextProvider } from "./provider";
import Chart from "./chart";

export default function HeatmapChart<TConfig = {}>(props: {
  custom: HeatmapCustom<TConfig>;
  data: HeatmapData;
  getScale: (data: HeatmapData) => HeatmapScale;
  config?: TConfig;
}): Widget {
  const { custom, data, getScale, config = {} as TConfig } = props;
  const scale = getScale(data);

  return HeatmapContextProvider({
    value: { custom, data, scale, config } as any,
    child: new Chart(),
  });
}
