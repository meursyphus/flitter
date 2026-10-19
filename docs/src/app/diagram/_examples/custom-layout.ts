import {
  Container,
  EdgeInsets,
  Expanded,
  Column,
  MainAxisSize,
  Row,
  Stack,
  StackFit,
  Text,
  TextStyle,
} from "flitter-ui";
import FlowDiagram from "@/components/diagram/flow-diagram";

export default function CustomLayout(theme: "light" | "dark" = "light") {
  return FlowDiagram({
    data: {
      nodes: [
        {
          id: "a",
          type: "input",
          position: { x: 0, y: 0 },
          data: { label: "Plan" },
        },
        {
          id: "b",
          type: "output",
          position: { x: 200, y: 120 },
          data: { label: "Build" },
        },
      ],
      edges: [{ id: "ab", source: "a", target: "b" }],
    },
    viewport: { fitView: { padding: 0.15, maxZoom: 1 } },
    config: { colorMode: theme,
      node: { fontSize: 14 }, minimap: { visible: false } },
    custom: {
      layout: (
        { background, viewport, selectionBox, toolbars, contextMenu, controls },
        { config },
      ) =>
        Column({
          children: [
            Expanded({
              child: Stack({
                fit: StackFit.expand,
                children: [
                  background,
                  viewport,
                  selectionBox,
                  toolbars,
                  contextMenu,
                ],
              }),
            }),
            Container({
              padding: EdgeInsets.all(12),
              color: config.colors.controlsBackground,
              child: Row({
                children: [
                  Expanded({
                    child: Text("Drag nodes · select · connect", {
                      style: new TextStyle({
                        fontSize: 13,
                        color: config.colors.nodeColor,
                      }),
                    }),
                  }),
                  controls,
                ],
              }),
            }),
          ],
        }),
      controls: ({ zoomIn, zoomOut, fitView }) =>
        Row({
          mainAxisSize: MainAxisSize.min,
          children: [zoomOut, fitView, zoomIn],
        }),
    },
  });
}
