/**
 * Code shown on the landing page. Rendered as highlighted text on the server
 * (no screenshots), so package names and APIs stay greppable.
 */

/** Matches `createHeroChart` in ./home.tsx; keep the two in sync. */
export const HERO_CODE = `import ToastAreaChart from "./charts/toast-area-chart";

ToastAreaChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { legend: "Seoul", values: [65, 59, 80, 81, 56, 72, 90] },
      { legend: "Seattle", values: [28, 48, 40, 52, 86, 64, 70] },
      { legend: "Sydney", values: [35, 25, 30, 45, 35, 40, 52] },
    ],
  },
  config: {
    title: { text: "Monthly visitors by city" },
    area: { spline: true, opacity: 0.28 },
  },
});`;

export const FLUTTER_CODE = `import 'package:flutter/material.dart';

Widget profileCard() {
  return Container(
    padding: EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: Colors.grey[200],
      borderRadius: BorderRadius.circular(10),
      boxShadow: [
        BoxShadow(
          color: Colors.grey.withOpacity(0.5),
          blurRadius: 7,
          offset: Offset(0, 3),
        ),
      ],
    ),
    child: Column(
      children: [
        Text('John Doe', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
        Text('Software Developer'),
        Text('john.doe@example.com'),
      ],
    ),
  );
}`;

export const FLITTER_CODE = `import { BorderRadius, BoxDecoration, BoxShadow, Column, Container, EdgeInsets, Text, TextStyle } from "flitter-ui";

function profileCard() {
  return Container({
    padding: EdgeInsets.all(20),
    decoration: new BoxDecoration({
      color: "#EEEEEE",
      borderRadius: BorderRadius.circular(10),
      boxShadow: [
        new BoxShadow({
          color: "rgba(158, 158, 158, 0.5)",
          blurRadius: 7,
          offset: { x: 0, y: 3 },
        }),
      ],
    }),
    child: Column({
      children: [
        Text("John Doe", { style: new TextStyle({ fontSize: 18, fontWeight: "500" }) }),
        Text("Software Developer"),
        Text("john.doe@example.com"),
      ],
    }),
  });
}`;
