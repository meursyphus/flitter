import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ entryRoot: "src", include: ["src"] })],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: () => "index.js" },
    rollupOptions: { external: (id) => id === "flitterjs" || id.startsWith("flitterjs/") },
  },
});
