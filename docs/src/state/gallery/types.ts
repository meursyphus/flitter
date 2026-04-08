export type GalleryState = {
  activeCategoryId: string;
};

export type GalleryActions = {
  setActiveCategory(id: string): void;
};
