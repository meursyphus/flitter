import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { observeGallery } from "./gallery-audit";
import { galleryEntries } from "../../../../docs/src/app/chart/_data/gallery/entries.generated";
import { buildChart } from "../../../../docs/src/lib/charts";

type Args = {
  slug: string;
  renderer: "svg" | "canvas";
  theme: "light" | "dark";
  width: number;
  animate: boolean;
  legendMode: "gallery" | "show";
};

function GalleryExample(args: Args) {
  const entry = galleryEntries.find((item) => item.slug === args.slug)!;
  const widget = buildChart(
    { theme: args.theme, animate: args.animate },
    entry.createWidget,
  );
  observeGallery(widget, entry.slug, args.legendMode === "show");
  return (
    <div
      data-testid="gallery-chart"
      style={{ background: args.theme === "dark" ? "#14171c" : "white" }}
    >
      <Widget
        widget={widget}
        width={`${args.width}px`}
        height="500px"
        renderer={args.renderer}
      />
    </div>
  );
}

const meta = {
  title: "Gallery/Interaction review",
  args: {
    renderer: "svg",
    theme: "light",
    width: 800,
    animate: true,
    legendMode: "gallery",
  },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    theme: { control: "inline-radio", options: ["light", "dark"] },
    width: { control: { type: "range", min: 360, max: 1200, step: 20 } },
    animate: { control: "boolean" },
    legendMode: { control: "inline-radio", options: ["gallery", "show"] },
    slug: { table: { disable: true } },
  },
  render: (args) => <GalleryExample {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BoxPlotAg: Story = {
  args: { slug: "box-plot-chart-ag-api-latency" },
};
export const BoxPlotToast: Story = {
  args: { slug: "box-plot-chart-toast-delivery-times" },
};
export const BulletAg: Story = {
  args: { slug: "bullet-chart-ag-revenue-targets" },
};
export const BulletToast: Story = {
  args: { slug: "bullet-chart-toast-service-quality" },
};
export const FunnelAg: Story = {
  args: { slug: "funnel-chart-ag-product-onboarding" },
};
export const FunnelToast: Story = {
  args: { slug: "funnel-chart-toast-sales-pipeline" },
};
export const HistogramAg: Story = {
  args: { slug: "histogram-chart-ag-parcel-weights" },
};
export const HistogramToast: Story = {
  args: { slug: "histogram-chart-toast-response-times" },
};
export const SankeyAg: Story = {
  args: { slug: "sankey-chart-ag-energy-flow" },
};
export const SankeyToast: Story = {
  args: { slug: "sankey-chart-toast-customer-journey" },
};
export const SunburstAg: Story = {
  args: { slug: "sunburst-chart-ag-org-structure" },
};
export const SunburstToast: Story = {
  args: { slug: "sunburst-chart-toast-world-population" },
};
export const WaterfallAg: Story = {
  args: { slug: "waterfall-chart-ag-operating-profit" },
};
export const WaterfallToast: Story = {
  args: { slug: "waterfall-chart-toast-project-budget" },
};
