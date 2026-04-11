import React from "react";
import FlitterWidget from "@flitterjs/react";

type DualRendererProps = {
  widget: any;
  width?: string;
  height?: string;
  description?: string;
};

const DualRenderer = ({
  widget,
  width = "400px",
  height = "400px",
  description = "",
}: DualRendererProps) => {
  return (
    <>
      <div style={{ display: "flex", gap: "24px" }}>
        <div>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>SVG</h4>
          <div
            style={{
              width: "fit-content",
              position: "relative",
              backgroundColor: "#e0e0e0",
            }}
          >
            <FlitterWidget
              widget={widget}
              width={width}
              height={height}
              renderer="svg"
            />
          </div>
        </div>
        <div>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#666" }}>Canvas</h4>
          <div
            style={{
              width: "fit-content",
              position: "relative",
              backgroundColor: "#e0e0e0",
            }}
          >
            <FlitterWidget
              widget={widget}
              width={width}
              height={height}
              renderer="canvas"
            />
          </div>
        </div>
      </div>
      {description && (
        <>
          <h3 style={{ marginTop: "20px", borderBottom: "1px solid grey" }}>
            Description
          </h3>
          <p
            style={{
              maxWidth: "700px",
              marginTop: "8px",
              lineHeight: "1.5em",
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </p>
        </>
      )}
    </>
  );
};

export default DualRenderer;
