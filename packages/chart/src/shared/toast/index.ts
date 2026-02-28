export { CheckBox } from "./checkbox";
export { type ToastBaseConfig } from "./config";
export { toastAxisLabel } from "./axis-label";
export { toastXAxisTick, toastYAxisTick } from "./axis-tick";
export { toastXAxisLine, toastYAxisLine } from "./axis-line";
export { toastGridXLine, toastGridYLine } from "./grid-line";
export { toastAxisCorner } from "./axis-corner";
export { toastTitle } from "./title";
export { toastLegend } from "./legend";
export { toastLayout } from "./layout";

const DEFAULT_TICK_SPACING = 80;

export const toastScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
