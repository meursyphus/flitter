import {
  StatefulWidget,
  State,
  BuildContext,
  GlobalKey,
  Offset,
  Transform,
  ZIndex,
} from "@meursyphus/flitter";
import type { Table } from "../../type";
import { classToFunction } from "../utils";
import DiagramControllerProvider from "../Provider/DiagramControllerProvider";
import baseNode from "./BaseNode";
import getNextZIndex from "../getNextZIndex";
import { LegacyNodeEvent, type EventManager } from "../../event";
import EventManagerProvider from "../Provider/EventManagerProvider";
import type { DiagramController } from "../../controller";

class Node extends StatefulWidget {
  table: Table;
  onLegacy: (key: GlobalKey) => void;
  constructor({
    table,
    onLegacy,
  }: {
    table: Table;
    onLegacy: (key: GlobalKey) => void;
  }) {
    super(table.id);
    this.table = table;
    this.onLegacy = onLegacy;
  }

  createState(): State<StatefulWidget> {
    return new NodeState();
  }
}

class NodeState extends State<Node> {
  nodeKey = new GlobalKey();
  controller!: DiagramController;
  eventManager!: EventManager;
  delta: Offset = Offset.zero();
  zIndex = 0;
  initState(context: BuildContext): void {
    super.initState(context);
    this.controller = DiagramControllerProvider.of(context);
    this.eventManager = EventManagerProvider.of(context);
  }

  handleDragStart = () => {
    this.setState(() => {
      this.zIndex = getNextZIndex();
    });
  };

  handleDragUpdate = ({
    movement,
  }: {
    delta: Offset;
    movement: Offset;
  }): void => {
    this.setState(() => {
      const translation = this.controller.getTranslation(movement);
      this.delta = this.delta.plus(translation);
    });
  };

  handleDragEnd = (): void => {
    this.widget.onLegacy(this.nodeKey);
    this.eventManager.dispatchEvent(
      new LegacyNodeEvent({
        tableName: this.widget.table.name,
        key: this.nodeKey,
      }),
    );
  };

  override build(_: BuildContext) {
    const { table } = this.widget;

    return Transform.translate({
      offset: this.delta,
      child: ZIndex({
        zIndex: this.zIndex,
        child: baseNode({
          table,
          key: this.nodeKey,
          onDragEnd: this.handleDragEnd,
          onDragStart: this.handleDragStart,
          onDragUpdate: this.handleDragUpdate,
        }),
      }),
    });
  }
}

export default classToFunction(Node);
