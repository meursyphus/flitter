import {
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  ChangeNotifier,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisSize,
  Positioned,
  Row,
  SizedBox,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  type BuildContext,
  type Widget,
} from "flitterjs";
import {
  FlowDiagramController,
  type ControlsCustomArgs,
  type FlowNode,
  type FlowEdge,
  type NodeBodyCustomArgs,
} from "@flitterjs/diagram";
import FlowDiagram, {
  ShapePaint,
  defaultEdge,
  defaultEdgePath,
} from "@/components/diagram/flow-diagram";

type Theme = "light" | "dark";
export type Customization = {
  node: "card" | "circle" | "chart";
  edge: "line" | "curve" | "pulse";
  controls: "dock" | "rail";
};
export const defaultCustomization: Customization = {
  node: "card",
  edge: "curve",
  controls: "dock",
};
export const builderNames = {
  node: { card: "CardNode", circle: "CircleNode", chart: "ChartNode" },
  edge: { line: "LineEdge", curve: "CurveEdge", pulse: "PulseEdge" },
  controls: { dock: "DockControls", rail: "RailControls" },
} as const;

/** The docs controls notify the mounted widget; they never recreate its graph. */
export class CustomizationModel extends ChangeNotifier {
  private value = { ...defaultCustomization };
  getSnapshot = (): Customization => this.value;
  subscribe = (listener: () => void) => {
    this.addListener(listener);
    return () => this.removeListener(listener);
  };
  change<K extends keyof Customization>(part: K, value: Customization[K]) {
    if (this.value[part] === value) return;
    this.value = { ...this.value, [part]: value };
    this.notifyListeners();
  }
  reset() {
    this.value = { ...defaultCustomization };
    this.notifyListeners();
  }
}

class CustomizationWidget extends StatefulWidget {
  constructor(
    readonly theme: Theme,
    readonly model: CustomizationModel,
  ) {
    super(theme);
  }
  createState() {
    return new CustomizationState();
  }
}
class CustomizationState extends State<CustomizationWidget> {
  readonly flow = new FlowDiagramController();
  private unsubscribe = () => {};
  readonly nodes: FlowNode[] = [
    {
      id: "orders",
      position: { x: 0, y: 120 },
      data: {
        label: "Orders",
        metric: "1.2k",
        color: "#72b6e9",
        values: [12, 8, 16, 10, 24, 21, 34],
      },
    },
    {
      id: "validate",
      position: { x: 290, y: 120 },
      data: {
        label: "Validate",
        metric: "99%",
        color: "#b899ec",
        values: [14, 19, 15, 26, 22, 30, 34],
      },
    },
    {
      id: "ship",
      position: { x: 580, y: 0 },
      data: {
        label: "Ship",
        metric: "842",
        color: "#67c5a6",
        values: [5, 12, 8, 20, 17, 27, 34],
      },
    },
    {
      id: "notify",
      position: { x: 580, y: 240 },
      data: {
        label: "Notify",
        metric: "128",
        color: "#e6ad66",
        values: [30, 18, 26, 12, 20, 9, 15],
      },
    },
  ].map((node) => ({ ...node, width: 190, height: 136 }));
  readonly edges: FlowEdge[] = [
    { id: "orders-validate", source: "orders", target: "validate" },
    { id: "validate-ship", source: "validate", target: "ship" },
    { id: "validate-notify", source: "validate", target: "notify" },
  ].map((edge) => ({ ...edge, markerEnd: "arrowclosed" }));
  override initState(context: BuildContext) {
    super.initState(context);
    this.unsubscribe = this.widget.model.subscribe(() => this.setState());
  }
  get c() {
    return this.widget.theme === "dark"
      ? {
          bg: "#14191f",
          card: "#222a34",
          ink: "#f0f3f8",
          muted: "#a4b0c1",
          line: "#445263",
          accent: "#fbbf24",
        }
      : {
          bg: "#f6f8fb",
          card: "#ffffff",
          ink: "#202c3d",
          muted: "#64758b",
          line: "#c8d3e0",
          accent: "#b86c00",
        };
  }
  text(value: string, size = 18, color = this.c.ink) {
    return Text(value, {
      style: new TextStyle({ fontFamily: "system-ui", fontSize: size, color }),
    });
  }
  CardNode = ({ node, isSelected }: NodeBodyCustomArgs): Widget =>
    Container({
      padding: EdgeInsets.all(18),
      decoration: new BoxDecoration({
        color: this.c.card,
        border: Border.all({
          color: isSelected ? this.c.accent : this.c.line,
          width: isSelected ? 2 : 1,
        }),
        borderRadius: BorderRadius.circular(10),
      }),
      child: Column({
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container({ width: 26, height: 4, color: String(node.data.color) }),
          SizedBox({ height: 14 }),
          this.text(String(node.data.label), 20),
          SizedBox({ height: 8 }),
          this.text(String(node.data.metric), 30),
        ],
      }),
    });
  CircleNode = ({ node, isSelected }: NodeBodyCustomArgs): Widget =>
    Column({
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container({
          width: 104,
          height: 104,
          alignment: Alignment.center,
          decoration: new BoxDecoration({
            shape: "circle",
            color: String(node.data.color),
            border: Border.all({
              color: isSelected ? this.c.accent : String(node.data.color),
              width: 3,
            }),
          }),
          child: this.text(String(node.data.metric), 28, "#142333"),
        }),
        SizedBox({ height: 10 }),
        this.text(String(node.data.label), 18),
      ],
    });
  ChartNode = ({ node, isSelected }: NodeBodyCustomArgs): Widget => {
    const values = node.data.values as number[];
    const d = values
      .map((value, index) => `${index ? "L" : "M"}${index * 25} ${38 - value}`)
      .join(" ");
    return Container({
      padding: EdgeInsets.all(16),
      decoration: new BoxDecoration({
        color: this.c.card,
        border: Border.all({
          color: isSelected ? this.c.accent : this.c.line,
          width: isSelected ? 2 : 1,
        }),
        borderRadius: BorderRadius.circular(10),
      }),
      child: Column({
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row({
            children: [
              this.text(String(node.data.label), 16),
              SizedBox({ width: 12 }),
              this.text(String(node.data.metric), 19),
            ],
          }),
          SizedBox({ height: 18 }),
          ShapePaint({
            width: 154,
            height: 42,
            shapes: {
              area: {
                d: `${d} L150 40 L0 40 Z`,
                fill: this.widget.theme === "dark" ? "#2c3949" : "#edf3fb",
              },
              line: {
                d,
                stroke: String(node.data.color),
                strokeWidth: 3,
                lineCap: "round",
              },
            },
          }),
        ],
      }),
    });
  };
  LineEdge = (
    args: Parameters<typeof defaultEdge>[0],
    context: Parameters<typeof defaultEdge>[1],
  ) =>
    defaultEdge(
      {
        ...args,
        isAnimated: false,
        edge: {
          ...args.edge,
          style: {
            stroke: args.isSelected ? this.c.accent : this.c.muted,
            strokeWidth: 2,
          },
        },
      },
      context,
    );
  CurveEdge = this.LineEdge;
  PulseEdge = (
    args: Parameters<typeof defaultEdge>[0],
    context: Parameters<typeof defaultEdge>[1],
  ) =>
    defaultEdge(
      {
        ...args,
        isAnimated: true,
        edge: {
          ...args.edge,
          style: { stroke: this.c.accent, strokeWidth: 3 },
        },
      },
      context,
    );
  DockControls = ({ zoomOut, fitView, zoomIn }: ControlsCustomArgs): Widget =>
    Container({
      padding: EdgeInsets.all(5),
      decoration: new BoxDecoration({
        color: this.c.card,
        border: Border.all({ color: this.c.line, width: 1 }),
        borderRadius: BorderRadius.circular(10),
      }),
      child: Row({
        mainAxisSize: MainAxisSize.min,
        children: [zoomOut, fitView, zoomIn],
      }),
    });
  RailControls = ({ zoomIn, zoomOut, fitView }: ControlsCustomArgs): Widget =>
    Container({
      padding: EdgeInsets.all(5),
      decoration: new BoxDecoration({
        color: this.c.card,
        border: Border.all({ color: this.c.line, width: 1 }),
        borderRadius: BorderRadius.circular(10),
      }),
      child: Column({
        mainAxisSize: MainAxisSize.min,
        children: [zoomIn, zoomOut, fitView],
      }),
    });
  build(): Widget {
    const options = this.widget.model.getSnapshot(),
      c = this.c;
    const node = {
      card: this.CardNode,
      circle: this.CircleNode,
      chart: this.ChartNode,
    }[options.node];
    const edge = {
      line: this.LineEdge,
      curve: this.CurveEdge,
      pulse: this.PulseEdge,
    }[options.edge];
    const controls = { dock: this.DockControls, rail: this.RailControls }[
      options.controls
    ];
    return FlowDiagram({
      controller: this.flow,
      data: { nodes: this.nodes, edges: this.edges },
      viewport: { minZoom: 0.2, fitView: { padding: 0.08, maxZoom: 1 } },
      interaction: { keys: { delete: null }, contextMenu: { enabled: false } },
      config: {
        colorMode: this.widget.theme,
        colors: {
          background: c.bg,
          controlsBackground: c.card,
          controlsColor: c.ink,
        },
        minimap: { visible: false },
        controls: { showInteractive: false, buttonSize: 36 },
      },
      getHandles: () => [
        {
          type: "target",
          position: "left",
          x: options.node === "circle" ? 43 : 0,
          y: options.node === "circle" ? 52 : 68,
        },
        {
          type: "source",
          position: "right",
          x: options.node === "circle" ? 147 : 190,
          y: options.node === "circle" ? 52 : 68,
        },
      ],
      getEdgePath: (args, context) =>
        defaultEdgePath(
          { ...args, type: options.edge === "line" ? "straight" : "bezier" },
          context,
        ),
      custom: {
        node,
        edge,
        controls,
        layout: ({
          background,
          viewport,
          selectionBox,
          toolbars,
          contextMenu,
          controls,
        }) =>
          Stack({
            fit: StackFit.expand,
            children: [
              background,
              viewport,
              selectionBox,
              toolbars,
              Positioned({
                ...(options.controls === "rail"
                  ? { left: 16, top: 16 }
                  : { right: 16, bottom: 16 }),
                child: controls,
              }),
              contextMenu,
            ],
          }),
        controlButton: ({ kind, isHovered }) =>
          Container({
            width: kind === "fitView" ? 50 : 36,
            height: 36,
            alignment: Alignment.center,
            decoration: new BoxDecoration({
              color: isHovered ? c.line : c.card,
              borderRadius: BorderRadius.circular(5),
            }),
            child: this.text(
              kind === "zoomIn" ? "+" : kind === "zoomOut" ? "−" : "Fit",
              kind === "fitView" ? 14 : 22,
            ),
          }),
      },
    });
  }
  dispose() {
    this.unsubscribe();
    this.flow.dispose();
    super.dispose();
  }
}
export default function CustomizationDemo(
  theme: Theme,
  model: CustomizationModel,
): Widget {
  return new CustomizationWidget(theme, model);
}
