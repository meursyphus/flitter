"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  Text,
  TextStyle,
  Column,
  MainAxisSize,
  CrossAxisAlignment,
  Border,
  BorderSide,
} from "flitter-ui";

export default function LargeToastScatterChart() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Series A",
              data: [
                { x: 1.2, y: 4.5, label: "Stripe" },
                { x: 0.8, y: 3.2, label: "Figma" },
                { x: 2.1, y: 8.5, label: "SpaceX" },
                { x: 0.5, y: 2.0, label: "Notion" },
                { x: 1.8, y: 6.8, label: "Databricks" },
              ],
            },
            {
              legend: "Series B",
              data: [
                { x: 3.5, y: 12.0, label: "Canva" },
                { x: 5.0, y: 18.5, label: "Discord" },
                { x: 4.2, y: 15.0, label: "Airtable" },
                { x: 2.8, y: 9.5, label: "Notion" },
                { x: 6.0, y: 22.0, label: "Plaid" },
              ],
            },
            {
              legend: "Series C+",
              data: [
                { x: 10.0, y: 35.0, label: "Stripe" },
                { x: 8.5, y: 28.0, label: "Databricks" },
                { x: 15.0, y: 50.0, label: "SpaceX" },
                { x: 7.0, y: 24.0, label: "Canva" },
                { x: 12.0, y: 42.0, label: "Discord" },
              ],
            },
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
                  bottom: new BorderSide({ color: "#7c3aed", width: 2 }),
                }),
              }),
              child: Column({
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(title.text, {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#1e1b4b",
                    }),
                  }),
                  Text("Investment rounds across top startups", {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 10,
                      color: "#6b7280",
                    }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          title: { text: "Startup Funding Rounds", visible: true },
          scatter: { size: 14, strokeWidth: 2 },
          colors: ["#7c3aed", "#ec4899", "#f59e0b"],
          axis: {
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "x" ? `$${name}B` : `$${name}B`,
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
