export { CheckBox } from "./checkbox";
export {
  type ToastBaseConfig,
  defaultToastBaseConfig,
} from "./cartesian/config";
export { toastTitle } from "./title";
export { toastLegend } from "./legend";
export { drawSplineLine } from "flitter-ui/chart";
export { tooltipContent } from "./tooltip";
export * as cartesian from "./cartesian";

const DEFAULT_TICK_SPACING = 80;

export const toastScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
