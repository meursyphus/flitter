"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  Border,
  BorderSide,
  EdgeInsets,
  Text,
  TextStyle,
  Column,
  Row,
  SizedBox,
  MainAxisSize,
  CrossAxisAlignment,
} from "flitter-ui";
import { BarChart } from "shared/chart";

export default function ExecutiveRevenueAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Product", values: [4.8, 5.2, 6.1] },
            { legend: "Services", values: [2.1, 2.4, 2.9] },
            { legend: "Licensing", values: [1.3, 1.1, 1.5] },
          ],
        },
        custom: {
          title: (
            _args: undefined,
            context: any,
          ) => {
            const { font, title } = context.config;
            return Container({
              padding: EdgeInsets.only({ bottom: 8 }),
              decoration: new BoxDecoration({
                border: new Border({
                  bottom: new BorderSide({ color: "#2563eb", width: 2 }),
                }),
              }),
              child: Column({
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row({
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("Q4 ", {
                        style: new TextStyle({
                          fontFamily: title.fontFamily ?? font.family,
                          fontSize: title.fontSize,
                          fontWeight: "700",
                          color: title.color,
                        }),
                      }),
                      Text("Revenue", {
                        style: new TextStyle({
                          fontFamily: title.fontFamily ?? font.family,
                          fontSize: title.fontSize,
                          fontWeight: "700",
                          color: "#2563eb",
                        }),
                      }),
                    ],
                  }),
                  SizedBox({ height: 2 }),
                  Text("Breakdown by stream ($M)", {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 12,
                      color: "#94a3b8",
                    }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          colors: { fills: ["#2563eb", "#7c3aed", "#e879f9"] },
          title: { text: "Q4 Revenue", visible: true },
          bar: { cornerRadius: 4 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
