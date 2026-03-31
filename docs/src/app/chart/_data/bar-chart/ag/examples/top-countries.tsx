"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";
import { Text, TextStyle, Row, SizedBox, MainAxisSize } from "flitter-ui";

const flags: Record<string, string> = {
  "United States": "🇺🇸",
  China: "🇨🇳",
  Japan: "🇯🇵",
  Germany: "🇩🇪",
  India: "🇮🇳",
  "United Kingdom": "🇬🇧",
  France: "🇫🇷",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  "South Korea": "🇰🇷",
};

export default function TopCountriesAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "horizontal",
        data: {
          labels: [
            "United States",
            "China",
            "Japan",
            "Germany",
            "India",
            "United Kingdom",
            "France",
            "Brazil",
            "Canada",
            "South Korea",
          ],
          datasets: [
            {
              legend: "GDP (T$)",
              values: [25.5, 17.9, 4.2, 4.1, 3.7, 3.1, 2.8, 1.9, 1.8, 1.7],
            },
          ],
        },
        config: {
          colors: { fills: ["#0284c7"] },
          bar: { cornerRadius: 3 },
        },
        custom: {
          yAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const flag = flags[name] ?? "";
            return Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(flag, {
                  style: new TextStyle({ fontSize: 14 }),
                }),
                SizedBox({ width: 4 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    color: "#334155",
                  }),
                }),
              ],
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
