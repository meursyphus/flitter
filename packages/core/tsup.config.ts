import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "component/Tooltip": "src/component/Tooltip.ts",
  },
  splitting: false,
  silent: true,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
});
