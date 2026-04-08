import type { ChartItem } from "./chart-carousel";
import { galleryEntries } from "../_data/gallery";

export const chartShowcase: ChartItem[] = galleryEntries.map((entry) => ({
  title: entry.title,
  subtitle: `${entry.style} Style`,
  chart: <entry.Component />,
  command: entry.installCommand,
  href: `/chart/gallery/${entry.slug}`,
}));
