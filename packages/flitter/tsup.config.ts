import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: true,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ["iife", "cjs", "esm"],
});
