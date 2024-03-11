import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: ["src/lib"] })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "@moonmoonbrothers/flutterjs"],
    },
  },
});
