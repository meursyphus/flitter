// Common (used by all chart types)
export { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "./cartesian/config";
export { agTitle } from "./title";
export { agLegend } from "./legend";
export { tooltipContent as agTooltipContent } from "./tooltip";
// Cartesian-specific (axis, grid, layout for cartesian charts)
export * as cartesian from "./cartesian";

// Bar-like (bar chart, stacked-bar chart)
export * from "./bar-like";

// Line-like (line chart, area chart)
export * from "./line-like";

const DEFAULT_TICK_SPACING = 160;

export const agScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
