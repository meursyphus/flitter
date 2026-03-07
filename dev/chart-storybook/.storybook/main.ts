import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const chartRoot = path.resolve(__dirname, "../../../packages/chart");
const chartStylesRoot = path.resolve(__dirname, "../../../shared/chart-styles");
const coreRoot = path.resolve(__dirname, "../../../packages/core");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "flitter-chart": path.resolve(chartRoot, "src/index.ts"),
      "flitter-core": path.resolve(coreRoot, "src/index.ts"),
      "chart-styles": path.resolve(chartStylesRoot, "index.ts"),
      "@shared": path.resolve(chartRoot, "src/shared"),
      "@styles": path.resolve(chartStylesRoot, "styles"),
      "@utils": path.resolve(chartRoot, "src/shared/utils"),
      "@headless": path.resolve(chartRoot, "src/headless"),
    };
    return config;
  },
};

export default config;
