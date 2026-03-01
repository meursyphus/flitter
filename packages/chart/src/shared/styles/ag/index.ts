export { type AgBaseConfig, defaultAgBaseConfig } from "./config";
export { agXAxisLabel, agYAxisLabel } from "./axis-label";
export { agXAxisTick, agYAxisTick } from "./axis-tick";
export { agXAxisLine, agYAxisLine } from "./axis-line";
export { agGridXLine, agGridYLine } from "./grid-line";
export { agAxisCorner } from "./axis-corner";
export { agTitle } from "./title";
export { agLegend } from "./legend";
export { agLayout } from "./layout";
export { agXAxis } from "./x-axis";
export { agYAxis } from "./y-axis";
export { agXAxisBox } from "./x-axis-box";
export { agYAxisBox } from "./y-axis-box";
export { tooltipContent as agTooltipContent } from "./tooltip";

const DEFAULT_TICK_SPACING = 80;

export const agScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
