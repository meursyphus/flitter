"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Widget from "@flitterjs/react";
import type { Widget as FlitterWidget } from "flitter-core";
import { buildChart } from "@/lib/charts";
import type { Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

type LiveChartProps = {
  /** Must call chart factories from `@/lib/charts`. Keep it referentially stable. */
  create: () => FlitterWidget;
  /** false shows the final frame at once — for grids and reels. */
  animate?: boolean;
  /** Mount only once the chart scrolls near the viewport. */
  lazy?: boolean;
  /** Pin a theme instead of following the site toggle. */
  theme?: Theme;
  renderer?: "svg" | "canvas";
  className?: string;
};

/**
 * Renders a chart with the engine itself, client-side. The widget is built
 * after mount, once the theme the server stamped on <html> is readable.
 */
export default function LiveChart({
  create,
  animate = true,
  lazy = false,
  theme: pinnedTheme,
  renderer = "svg",
  className = "h-full w-full",
}: LiveChartProps) {
  const { theme: siteTheme } = useTheme();
  const theme = pinnedTheme ?? siteTheme;
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!lazy || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  const widget = useMemo(
    () => (inView ? buildChart({ theme, animate }, create) : null),
    [inView, theme, animate, create],
  );

  return (
    <div ref={ref} className={className}>
      {widget && (
        <Widget widget={widget} width="100%" height="100%" renderer={renderer} />
      )}
    </div>
  );
}
