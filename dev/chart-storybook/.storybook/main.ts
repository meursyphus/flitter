// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const chartRoot = path.resolve(__dirname, "../../../packages/chart");
const flitterUiRoot = path.resolve(__dirname, "../../../packages/flitter");
const chartPresetsRoot = path.resolve(__dirname, "../../../shared/chart-presets");
const coreRoot = path.resolve(__dirname, "../../../packages/core");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-docs")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "flitter-core/component/Tooltip": path.resolve(coreRoot, "src/component/Tooltip.ts"),
      "flitter-ui/chart": path.resolve(flitterUiRoot, "src/chart.ts"),
      "flitter-chart": path.resolve(chartRoot, "src/index.ts"),
      "flitter-core": path.resolve(coreRoot, "src/index.ts"),
      "shared/chart": path.resolve(__dirname, "../../shared/chart.ts"),
      "chart-presets": path.resolve(chartPresetsRoot, "index.ts"),
      "@shared": path.resolve(chartRoot, "src/shared"),
      "@utils": path.resolve(chartRoot, "src/shared/utils"),
      "@headless": path.resolve(chartRoot, "src/headless"),
    };
    config.build = {
      ...config.build,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        ...config.build?.rollupOptions,
        onwarn(warning, warn) {
          const message = typeof warning === "string" ? warning : warning.message ?? "";
          if (
            message.includes("@storybook/core/dist/preview/runtime.js") &&
            message.includes("Use of eval")
          ) {
            return;
          }
          warn(warning);
        },
      },
    };
    return config;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
