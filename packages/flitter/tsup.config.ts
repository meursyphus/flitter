import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    chart: "src/chart.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["flitter-core", "flitter-chart"],
});
