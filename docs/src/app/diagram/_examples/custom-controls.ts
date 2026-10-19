import {
  BorderRadius,
  BoxDecoration,
  Container,
  EdgeInsets,
  MainAxisSize,
  Row,
  Text,
  TextStyle,
} from "flitterjs";
import FlowDiagram from "@/components/diagram/flow-diagram";

export default function CustomControls(theme: "light" | "dark" = "light") {
  return FlowDiagram({
    data: {
      nodes: [
        {
          id: "a",
          type: "input",
          position: { x: 0, y: 0 },
          data: { label: "Source" },
        },
        {
          id: "b",
          type: "output",
          position: { x: 200, y: 120 },
          data: { label: "Result" },
        },
      ],
      edges: [{ id: "ab", source: "a", target: "b" }],
    },
    viewport: { fitView: { padding: 0.1, maxZoom: 1.2 } },
    config: {
      colorMode: theme,
      node: { fontSize: 14 },
      controls: { position: "bottom-center" },
      minimap: { visible: false },
    },
    custom: {
      // These are widgets with zoom/fit/lock behavior already attached.
      controls: ({ zoomIn, zoomOut, fitView, interactive }) =>
        Row({
          mainAxisSize: MainAxisSize.min,
          children: [zoomOut, fitView, zoomIn, interactive],
        }),
      controlButton: ({ kind, isHovered, isInteractive }, { config }) =>
        Container({
          padding: EdgeInsets.symmetric({ horizontal: 14, vertical: 10 }),
          decoration: new BoxDecoration({
            color: isHovered ? "#7c3aed" : config.colors.controlsBackground,
            borderRadius: BorderRadius.circular(8),
          }),
          child: Text(
            {
              zoomIn: "+",
              zoomOut: "−",
              fitView: "Fit",
              interactive: isInteractive ? "Lock" : "Unlock",
            }[kind],
            {
              style: new TextStyle({
                fontSize: 14,
                color: isHovered ? "#ffffff" : config.colors.controlsColor,
              }),
            },
          ),
        }),
    },
  });
}
