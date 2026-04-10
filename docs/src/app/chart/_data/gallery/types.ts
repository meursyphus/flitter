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
  Component: React.ComponentType;
  files: GalleryCodeFile[];
  installCommand: string;
};
