import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const chartRoot = path.resolve(__dirname, "../../../packages/chart");

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
      "@shared": path.resolve(chartRoot, "src/shared"),
      "@utils": path.resolve(chartRoot, "src/shared/utils"),
      "@headless": path.resolve(chartRoot, "src/headless"),
    };
    return config;
  },
};

export default config;
