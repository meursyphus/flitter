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
    // One copy of the engine: `@flitterjs/react` imports `flitter-ui`, whose
    // dist bundle would otherwise duplicate `flitter-core` and break
    // `instanceof` checks between widgets and the renderer.
    config.resolve.alias = {
      ...config.resolve.alias,
      "flitter-core/component/Tooltip": path.resolve(coreRoot, "src/component/Tooltip.ts"),
      "flitter-ui/chart": path.resolve(flitterUiRoot, "src/chart.ts"),
      "flitter-ui/diagram": path.resolve(flitterUiRoot, "src/diagram.ts"),
      "flitter-diagram/engine": path.resolve(diagramRoot, "src/engine.ts"),
      "diagram-presets": path.resolve(diagramPresetsRoot, "index.ts"),
      "flitter-ui": path.resolve(flitterUiRoot, "src/index.ts"),
      "flitter-core": path.resolve(coreRoot, "src/index.ts"),
      "flitter-diagram": path.resolve(diagramRoot, "src/index.ts"),
    };
    return config;
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
