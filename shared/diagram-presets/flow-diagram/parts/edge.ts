import {
  AnimationController,
  Border,
  BorderRadius,
  BoxDecoration,
  type BuildContext,
  Container,
  EdgeInsets,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  type Widget,
} from "flitter-ui";
import {
  type EdgePathResult,
  commandsEndAngle,
  commandsStartAngle,
  commandsToD,
  getEdgePathByType,
  getMarkerCommands,
} from "flitter-ui/diagram";
import type {
  ConnectionLineBuilderArgs,
  EdgeBuilderArgs,
  EdgeLabelBuilderArgs,
  EdgeMarker,
  EdgePathBuilderArgs,
  EdgeTypeDefinition,
  FlowContext,
} from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, type ShapeSpec } from "./paint";

function markerShape(
  marker: EdgeMarker | null,
  path: EdgePathResult,
  end: "start" | "end",
  stroke: string,
  strokeWidth: number,
  config: DefaultFlowConfig,
): ShapeSpec | null {
  if (!marker) return null;
  const commands = path.commands;
  const first = commands[0];
  const last = commands[commands.length - 1];
  if (!first || !last) return null;
  const point = end === "start" ? { x: first.x, y: first.y } : { x: last.x, y: last.y };
  const angle = end === "start" ? commandsStartAngle(commands) : commandsEndAngle(commands);
  const color = marker.color ?? config.edge.markerColor ?? stroke;
  const d = commandsToD(
    getMarkerCommands(point, angle, {
      type: marker.type,
      size: Math.min(marker.width ?? config.edge.markerSize, marker.height ?? config.edge.markerSize),
      strokeWidth: marker.strokeWidth ?? strokeWidth,
    }),
  );
  return {
    d,
    stroke: color,
    strokeWidth: marker.strokeWidth ?? 1,
    fill: marker.type === "arrowclosed" ? color : "none",
    lineCap: "round",
  };
}

class AnimatedEdgePaint extends StatefulWidget {
  constructor(
    readonly props: {
      width: number;
      height: number;
      shapes: Record<string, ShapeSpec | null>;
      dash: number;
      duration: number;
    },
  ) {
    super();
  }
  override createState(): State<AnimatedEdgePaint> {
    return new AnimatedEdgePaintState();
  }
}

class AnimatedEdgePaintState extends State<AnimatedEdgePaint> {
  controller!: AnimationController;
  override initState(context: BuildContext): void {
    super.initState(context);
    this.controller = new AnimationController({ duration: this.widget.props.duration });
    this.controller.addListener(this.tick);
    this.controller.repeat();
  }
  private tick = () => this.setState();
  override dispose(): void {
    this.controller.removeListener(this.tick);
    this.controller.dispose();
    super.dispose();
  }
  override build(): Widget {
    const { width, height, shapes, dash } = this.widget.props;
    const offset = dash * 2 * (1 - this.controller.value);
    const main = shapes.main;
    return ShapePaint({
      width,
      height,
      shapes: { ...shapes, main: main ? { ...main, dash: [dash], dashOffset: offset } : null },
    });
  }
}

/** React Flow's default edge: 1px stroke, selected edges darker, optional arrow markers. */
export function defaultEdge(args: EdgeBuilderArgs, context: FlowContext<DefaultFlowConfig>): Widget {
  const { config } = context;
  const { edge, path, size, selected, animated, reconnecting } = args;
  const stroke =
    edge.style?.stroke ??
    (reconnecting ? config.colors.edgeStrokeUpdating : selected ? config.colors.edgeStrokeSelected : config.colors.edgeStroke);
  const strokeWidth = edge.style?.strokeWidth ?? config.edge.strokeWidth;
  const shapes: Record<string, ShapeSpec | null> = {
    main: { d: commandsToD(path.commands), stroke, strokeWidth },
    markerStart: markerShape(args.markerStart, path, "start", stroke, strokeWidth, config),
    markerEnd: markerShape(args.markerEnd, path, "end", stroke, strokeWidth, config),
  };
  if (animated) {
    return new AnimatedEdgePaint({
      width: size.width,
      height: size.height,
      shapes,
      dash: config.edge.animatedDash,
      duration: config.edge.animationDuration,
    });
  }
  return ShapePaint({ width: size.width, height: size.height, shapes });
}

export function defaultEdgeLabel(args: EdgeLabelBuilderArgs, context: FlowContext<DefaultFlowConfig>): Widget {
  const { colors, edgeLabel, node } = context.config;
  return Container({
    padding: EdgeInsets.symmetric({ horizontal: edgeLabel.paddingX, vertical: edgeLabel.paddingY }),
    decoration: new BoxDecoration({
      color: edgeLabel.showBackground ? colors.edgeLabelBackground : "transparent",
      borderRadius: BorderRadius.circular(edgeLabel.borderRadius),
      border: args.selected ? Border.all({ color: colors.edgeStrokeSelected, width: 1 }) : undefined,
    }),
    child: Text(args.label, {
      style: new TextStyle({ fontSize: edgeLabel.fontSize, color: colors.edgeLabelColor, fontFamily: node.fontFamily }),
    }),
  });
}

export function defaultConnectionLine(args: ConnectionLineBuilderArgs, context: FlowContext<DefaultFlowConfig>): Widget {
  const { colors, connectionLine } = context.config;
  const stroke = args.isValid === false ? colors.handleInvalid : args.isValid ? colors.handleValid : colors.connectionLine;
  return ShapePaint({
    width: args.size.width,
    height: args.size.height,
    shapes: {
      main: { d: commandsToD(args.path.commands), stroke, strokeWidth: connectionLine.strokeWidth },
    },
  });
}

/** Built-in path geometry with the style's curvature/offset defaults. */
export function defaultEdgePath(args: EdgePathBuilderArgs, context: FlowContext<DefaultFlowConfig>) {
  const { edge: e } = context.config;
  const options = {
    curvature: args.edge?.pathOptions?.curvature ?? e.curvature,
    offset: args.edge?.pathOptions?.offset ?? e.stepOffset,
    borderRadius: args.edge?.pathOptions?.borderRadius ?? e.stepBorderRadius,
  };
  return getEdgePathByType(args.type, args.params, options);
}

export const defaultEdgeTypes: Record<string, EdgeTypeDefinition<DefaultFlowConfig>> = {
  default: { build: defaultEdge },
  bezier: { build: defaultEdge },
  simplebezier: { build: defaultEdge },
  straight: { build: defaultEdge },
  step: { build: defaultEdge },
  smoothstep: { build: defaultEdge },
};
