"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Widget from "@flitterjs/adapter-react";
import {
  Container,
  GlobalKey,
  type Widget as FlitterWidget,
} from "flitterjs";
import { diagramLayoutSnapshot } from "./diagram-layout-snapshot";
import type { Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

type LiveDiagramProps = {
  /**
   * Builds the diagram for a site theme. Keep it referentially stable (define
   * it at module scope): `@flitterjs/adapter-react` remounts the app whenever the
   * widget identity changes, which resets every node position.
   */
  create: (theme: Theme) => FlitterWidget;
  /** Mount only once the diagram scrolls near the viewport. */
  lazy?: boolean;
  /** Pin a theme instead of following the site toggle. */
  theme?: Theme;
  renderer?: "svg" | "canvas";
  className?: string;
  /** Expose a read-only layout probe for the gallery regression checker. */
  inspectLayout?: boolean;
};

/**
 * Renders a `@flitterjs/diagram` widget client-side. Like `LiveChart`, the widget
 * is built after mount so nothing runs during static prerendering.
 */
export default function LiveDiagram({
  create,
  inspectLayout = false,
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

  const layoutKey = useMemo(() => new GlobalKey(), []);
  const widget = useMemo(
    () =>
      inView
        ? inspectLayout
          ? Container({ key: layoutKey, child: create(theme) })
          : create(theme)
        : null,
    [inView, theme, create, inspectLayout, layoutKey],
  );
  useEffect(() => {
    const el = ref.current as
      | (HTMLDivElement & {
          diagramLayout?: () => ReturnType<typeof diagramLayoutSnapshot>;
        })
      | null;
    if (!el || !inspectLayout || !widget) return;
    el.diagramLayout = () =>
      diagramLayoutSnapshot(layoutKey.currentContext.renderObject);
    return () => {
      delete el.diagramLayout;
    };
  }, [inspectLayout, widget, layoutKey]);

  return (
    <div
      ref={ref}
      className={className}
      data-diagram-layout={inspectLayout ? "" : undefined}
    >
      {widget && (
        <Widget
          widget={widget}
          width="100%"
          height="100%"
          renderer={renderer}
        />
      )}
    </div>
  );
}
