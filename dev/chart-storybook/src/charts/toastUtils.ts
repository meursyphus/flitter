import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  Padding,
  SizedBox,
  Column,
  CrossAxisAlignment,
  Expanded,
} from "flitter-core";

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

export function toastLayout({ plot }: { plot: any; [key: string]: any }) {
  return Container({
    padding: EdgeInsets.only({ left: 60, bottom: 40, top: 30, right: 20 }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text("Inspired by Toast", {
          style: new TextStyle({
            fontSize: 13,
            color: "#999999",
            fontFamily: "Noto Sans JP",
          }),
        }),
        SizedBox({ height: 4 }),
        Expanded({ child: plot }),
      ],
    }),
  });
}

export function toastNonCartesianLayout(
  mainChild: any,
  mainKey: string = "pie"
) {
  return ({ [mainKey]: child }: any) =>
    Container({
      padding: EdgeInsets.all(20),
      child: Column({
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Text("Inspired by Toast", {
            style: new TextStyle({
              fontSize: 13,
              color: "#999999",
              fontFamily: "Noto Sans JP",
            }),
          }),
          SizedBox({ height: 4 }),
          Expanded({ child: child }),
        ],
      }),
    });
}

export function toastXAxisLabel({ name }: { name: string }) {
  return Padding({
    padding: EdgeInsets.only({ top: 1 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: "Noto Sans JP",
        fontSize: 11,
        color: "#666666",
      }),
    }),
  });
}

export function toastYAxisLabel({ name }: { name: string }) {
  return Padding({
    padding: EdgeInsets.only({ right: 1 }),
    child: Text(name, {
      style: new TextStyle({
        fontFamily: "Noto Sans JP",
        fontSize: 11,
        color: "#666666",
      }),
    }),
  });
}

export function toastXAxisTick() {
  return Container({ height: 6, width: 1, color: "#BBBBBB" });
}

export function toastYAxisTick() {
  return Container({ height: 1, width: 6, color: "#BBBBBB" });
}

export function toastXAxisLine() {
  return Container({ color: "#BBBBBB", height: 1, width: Infinity });
}

export function toastYAxisLine() {
  return Container({ color: "#BBBBBB", width: 1, height: Infinity });
}

export function toastGridXLine() {
  return Container({ height: 1, color: "#EEEEEE" });
}

export function toastGridYLine() {
  return Container({ width: 1, color: "#EEEEEE" });
}

export function toastLegend() {
  return SizedBox.shrink();
}

export const cartesianToastCustom = {
  layout: toastLayout,
  xAxisLabel: toastXAxisLabel,
  yAxisLabel: toastYAxisLabel,
  xAxisTick: toastXAxisTick,
  yAxisTick: toastYAxisTick,
  xAxisLine: toastXAxisLine,
  yAxisLine: toastYAxisLine,
  gridXLine: toastGridXLine,
  gridYLine: toastGridYLine,
  legend: toastLegend,
};
