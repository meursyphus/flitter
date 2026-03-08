import Widget from "@flitterjs/react";
import type { Widget as FlitterWidget } from "flitter-core";

type Renderer = "svg" | "canvas";

type StyleParityItem = {
  label: string;
  widget: FlitterWidget;
  note?: string;
};

export function StyleParityShowcase({
  renderer,
  items,
  width = "520px",
  height = "340px",
}: {
  renderer: Renderer;
  items: StyleParityItem[];
  width?: string;
  height?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: 20,
        width: "min(1120px, 100%)",
      }}
    >
      {items.map((item) => (
        <section
          key={item.label}
          style={{
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 16,
            background: "#fff",
            padding: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 12,
              gap: 12,
            }}
          >
            <strong style={{ fontSize: 15 }}>{item.label}</strong>
            {item.note ? (
              <span style={{ color: "#666", fontSize: 12 }}>{item.note}</span>
            ) : null}
          </div>
          <Widget
            widget={item.widget}
            width={width}
            height={height}
            renderer={renderer}
          />
        </section>
      ))}
    </div>
  );
}
