export const TOAST_COLORS = [
  "#00a9ff",
  "#ffb840",
  "#ff5a46",
  "#00bd9f",
  "#785fff",
  "#f28b8c",
  "#989486",
  "#516f7d",
  "#28e6eb",
  "#28695f",
];

export type ToastBarChartConfig = {
  colors: string[];
  font: { family: string; size: number };
  axisColor: string;
  gridColor: string;
  labelColor: string;
  animation: { duration: number; staggerDelay: number };
};

export const defaultToastConfig: ToastBarChartConfig = {
  colors: TOAST_COLORS,
  font: { family: "Noto Sans JP", size: 11 },
  axisColor: "#BBBBBB",
  gridColor: "#EEEEEE",
  labelColor: "#666666",
  animation: { duration: 500, staggerDelay: 60 },
};
