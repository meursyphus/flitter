import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "flitter-diagram",
      fileName: (format) => `flitter-diagram.${format}.js`,
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
