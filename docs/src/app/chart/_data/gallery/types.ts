export type GalleryCategory = {
  id: string;
  label: string;
};

export type GalleryEntry = {
  slug: string;
  chartType: string;
  style: "Toast" | "AG";
  title: string;
  Component: React.ComponentType;
  code: string;
  installCommand: string;
};
