import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [tsconfigPaths(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "flitter-chart",
      fileName: (format) => `flitter-chart.${format}.js`,
    },
    rollupOptions: {
      external: ["flitter-core"],
      output: {
        globals: {
          "flitter-core": "flitterCore",
        },
      },
    },
  },
});
