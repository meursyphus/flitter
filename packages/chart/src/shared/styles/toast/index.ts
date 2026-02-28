export { CheckBox } from "./checkbox";
export { type ToastBaseConfig, defaultToastBaseConfig } from "./config";
export { toastXAxisLabel, toastYAxisLabel } from "./axis-label";
export { toastXAxisTick, toastYAxisTick } from "./axis-tick";
export { toastXAxisLine, toastYAxisLine } from "./axis-line";
export { toastGridXLine, toastGridYLine } from "./grid-line";
export { toastAxisCorner } from "./axis-corner";
export { toastTitle } from "./title";
export { toastLegend } from "./legend";
export { toastLayout } from "./layout";
export { toastXAxis } from "./x-axis";
export { toastYAxis } from "./y-axis";
export { toastXAxisBox } from "./x-axis-box";
export { toastYAxisBox } from "./y-axis-box";

const DEFAULT_TICK_SPACING = 80;

export const toastScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
