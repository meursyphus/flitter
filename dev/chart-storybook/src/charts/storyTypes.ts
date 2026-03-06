export type StoryRenderer = "svg" | "canvas";

export type StoryFrameProps = {
  renderer?: StoryRenderer;
  width?: string;
  height?: string;
};
