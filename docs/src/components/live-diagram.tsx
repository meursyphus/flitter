"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Widget from "@flitterjs/react";
import type { Widget as FlitterWidget } from "flitter-core";
import type { Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

type LiveDiagramProps = {
  /**
   * Builds the diagram for a site theme. Keep it referentially stable (define
   * it at module scope): `@flitterjs/react` remounts the app whenever the
   * widget identity changes, which resets every node position.
   */
  create: (theme: Theme) => FlitterWidget;
  /** Mount only once the diagram scrolls near the viewport. */
  lazy?: boolean;
  /** Pin a theme instead of following the site toggle. */
  theme?: Theme;
  renderer?: "svg" | "canvas";
  className?: string;
};

/**
 * Renders a `flitter-diagram` widget client-side. Like `LiveChart`, the widget
 * is built after mount so nothing runs during static prerendering.
 */
export default function LiveDiagram({
  create,
  lazy = false,
  theme: pinnedTheme,
  renderer = "svg",
  className = "h-full w-full",
}: LiveDiagramProps) {
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
    () => (inView ? create(theme) : null),
    [inView, theme, create],
  );

  return (
    <div ref={ref} className={className}>
      {widget && (
        <Widget widget={widget} width="100%" height="100%" renderer={renderer} />
      )}
    </div>
  );
}
