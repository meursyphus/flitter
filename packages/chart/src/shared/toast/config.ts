/**
 * Common config shape shared by all toast-style chart configs.
 * Individual chart configs extend this with chart-specific settings.
 */
export type ToastBaseConfig = {
  colors: string[];
  font: { family: string; size: number };
  title: {
    visible: boolean;
    color: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
    position: "top" | "bottom";
    alignment: "start" | "center" | "end";
  };
  legend: {
    visible: boolean;
    position: "top" | "bottom" | "right";
  };
  axis: {
    color: string;
    thickness: number;
    label: { color: string; fontSize: number; gap: number };
    tick: { size: number };
  };
  grid: { color: string; thickness: number };
  padding: { top: number; right: number; bottom: number; left: number };
  animation: { enabled: boolean; duration: number; staggerDelay: number };
};
