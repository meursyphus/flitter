import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    chart: "src/chart.ts",
    diagram: "src/diagram.ts",
  },
  format: ["cjs", "esm"],
  dts: {
    resolve: ["flitter-core", "flitter-chart", "flitter-diagram", "flitter-diagram/engine"],
  },
  clean: true,
  noExternal: ["flitter-core", "flitter-chart", "flitter-diagram", "flitter-diagram/engine"],
});
