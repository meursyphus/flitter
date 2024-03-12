import {
  StatefulWidget,
  State,
  BuildContext,
  Offset,
  Positioned,
  ZIndex,
} from "@meursyphus/flitter";
import type { Table } from "../../type";
import { classToFunction } from "../utils";
import DiagramControllerProvider from "../Provider/DiagramControllerProvider";
import baseNode from "./BaseNode";
import getNextZIndex from "../getNextZIndex";
import type { DiagramController } from "../../controller";
import { EventManager, NodeAlignTranslationEvent } from "../../event";
import { EventManagerProvider } from "../Provider";

class Node extends StatefulWidget {
  key?: unknown;
  table: Table;
  position: Offset;
  onPositionChange: (position: Offset) => void;
  constructor({
    table,
    position,
    onPositionChange,
    key,
  }: {
    table: Table;
    position: Offset;
    onPositionChange: (position: Offset) => void;
    key?: unknown;
  }) {
    super(table.id);
    this.table = table;
    this.position = position;
    this.onPositionChange = onPositionChange;
    this.key = key;
  }

  createState(): State<StatefulWidget> {
    return new NodeState();
  }
}

class NodeState extends State<Node> {
  controller!: DiagramController;
  eventManager!: EventManager;
  zIndex: number = getNextZIndex();
  position!: Offset;

  override initState(context: BuildContext): void {
    super.initState(context);
    this.position = this.widget.position;
    this.controller = DiagramControllerProvider.of(context);
    this.eventManager = EventManagerProvider.of(context);

    this.eventManager.addEventListener(
      NodeAlignTranslationEvent.type,
      this.handleAlignTranslation,
    );
  }

  override dispose() {
    this.eventManager.removeEventListener(
      NodeAlignTranslationEvent.type,
      this.handleAlignTranslation,
    );
  }

  handleDragStart = () => {
    this.setState(() => {
      this.zIndex = getNextZIndex();
    });
  };

  handleDragUpdate = ({ movement }: { movement: Offset }): void => {
    this.setState(() => {
      const resolvedTranslation = this.controller.getTranslation(movement);
      this.position = this.position.plus(resolvedTranslation);
      this.widget.onPositionChange(this.position);
    });
  };

  handleAlignTranslation = (e: NodeAlignTranslationEvent) => {
    if (e.tableName !== this.widget.table.name) return;
    this.setState(() => {
      this.position = this.position.plus(e.translation);
      this.widget.onPositionChange(this.position);
    });
  };

  override build(_: BuildContext) {
    const { table } = this.widget;

    return Positioned({
      key: this.widget.key,
      left: this.position.x,
      top: this.position.y,
      child: ZIndex({
        zIndex: this.zIndex,
        child: baseNode({
          table,
          onDragStart: this.handleDragStart,
          onDragUpdate: this.handleDragUpdate,
        }),
      }),
    });
  }
}

export default classToFunction(Node);
