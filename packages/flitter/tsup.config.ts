import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    chart: "src/chart.ts",
  },
  format: ["cjs", "esm"],
  dts: {
    resolve: ["flitter-core", "flitter-chart"],
  },
  clean: true,
  noExternal: ["flitter-core", "flitter-chart"],
});
