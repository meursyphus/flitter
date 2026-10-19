import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(__dirname, "../../../packages/core");
const flitterUiRoot = path.resolve(__dirname, "../../../packages/flitter");
const diagramRoot = path.resolve(__dirname, "../../../packages/diagram");
const diagramPresetsRoot = path.resolve(__dirname, "../../../shared/diagram-presets");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    // One copy of the engine: `@flitterjs/adapter-react` imports `flitterjs`, whose
    // dist bundle would otherwise duplicate `flitterjs` and break
    // `instanceof` checks between widgets and the renderer.
    config.resolve.alias = {
      ...config.resolve.alias,
      "flitterjs/component/Tooltip": path.resolve(coreRoot, "src/component/Tooltip.ts"),
      "@flitterjs/chart": path.resolve(flitterUiRoot, "src/chart.ts"),
      "@flitterjs/diagram": path.resolve(flitterUiRoot, "src/diagram.ts"),
      "@flitterjs/diagram": path.resolve(diagramRoot, "src/engine.ts"),
      "diagram-presets": path.resolve(diagramPresetsRoot, "index.ts"),
      "flitterjs": path.resolve(flitterUiRoot, "src/index.ts"),
      "flitterjs": path.resolve(coreRoot, "src/index.ts"),
      "@flitterjs/diagram": path.resolve(diagramRoot, "src/index.ts"),
    };
    return config;
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
