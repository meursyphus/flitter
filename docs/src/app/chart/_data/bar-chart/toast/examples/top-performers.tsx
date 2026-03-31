"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  EdgeInsets,
  Text,
  TextStyle,
  Column,
  MainAxisSize,
  CrossAxisAlignment,
  SizedBox,
} from "flitter-ui";

export default function TopPerformersToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Alice", "Bob", "Carol", "Dave", "Eve"],
          datasets: [{ legend: "Sales ($K)", values: [142, 128, 115, 98, 87] }],
        },
        config: {
          colors: ["#f97316"],
          bar: { cornerRadius: 3 },
          title: { text: "Top Performers", visible: true, alignment: "center" },
        },
        custom: {
          title: (
            _args: undefined,
            context: any,
          ) => {
            const { font, title } = context.config;
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 8 }),
              decoration: new BoxDecoration({
                color: "#fff7ed",
                borderRadius: BorderRadius.circular(8),
              }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text("🏆 Top Performers", {
                    style: new TextStyle({
                      fontFamily: title.fontFamily ?? font.family,
                      fontSize: title.fontSize,
                      fontWeight: "700",
                      color: "#c2410c",
                    }),
                  }),
                  SizedBox({ height: 2 }),
                  Text("Monthly sales ranking", {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 11,
                      color: "#ea580c",
                    }),
                  }),
                ],
              }),
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
