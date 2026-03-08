export { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "./cartesian/config";
export { agTitle } from "./title";
export { agLegend } from "./legend";
export { tooltipContent as agTooltipContent } from "./tooltip";
export * as cartesian from "./cartesian";
export { AgTooltipOverlay } from "./bar-like";
export { AgLineLikeTooltipOverlay } from "./line-like";

const DEFAULT_TICK_SPACING = 160;

export const agScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
