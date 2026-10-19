import type { Widget } from "flitterjs";

export type GalleryCategory = {
  id: string;
  label: string;
};

export type GalleryCodeFile = {
  filename: string;
  code: string;
};

export type GalleryEntry = {
  slug: string;
  chartType: string;
  style: "Toast" | "AG";
  title: string;
  thumbnailUrl: string;
  createWidget: () => Widget;
  files: GalleryCodeFile[];
  installCommand: string;
};
