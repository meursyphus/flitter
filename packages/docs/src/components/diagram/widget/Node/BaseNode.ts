import type { Table } from "../../type";
import Draggable from "./Draggable";
import Field from "../Field/Field";
import {
  GestureDetector,
  Border,
  BoxDecoration,
  Column,
  Container,
  MainAxisSize,
  IntrinsicWidth,
  BorderSide,
  EdgeInsets,
  Row,
  MainAxisAlignment,
  Text,
  TextStyle,
  GlobalKey,
  Offset,
  StatefulWidget,
  State,
  Element,
  ConstraintsTransformBox,
  Constraints,
  Padding,
} from "@meursyphus/flitter";
import { classToFunction } from "../utils";
import EventManagerProvider from "../Provider/EventManagerProvider";
import {
  ActiveRelationEvent,
  NodeInsertEvent,
  type EventManager,
  NodeRemoveEvent,
  NodeTranslationEvent,
  NodeTranslationEndEvent,
  NodeLayoutChangeEvent,
} from "../../event";
import DiagramControllerProvider from "../Provider/DiagramControllerProvider";
import type { DiagramController } from "../../controller";
import { ChangedLayoutNotifier } from "../ChangeNotifier";

class baseNode extends StatefulWidget {
  table: Table;
  onDragEnd?: () => void;
  onDragUpdate?: (_: { delta: Offset; movement: Offset }) => void;
  onDragStart?: () => void;

  constructor({
    key,
    table,
    onDragEnd,
    onDragUpdate,
    onDragStart,
  }: {
    key?: GlobalKey;
    table: Table;
    onDragEnd?: () => void;
    onDragUpdate?: (_: { delta: Offset; movement: Offset }) => void;
    onDragStart?: () => void;
  }) {
    super(key);
    this.table = table;
    this.onDragEnd = onDragEnd;
    this.onDragStart = onDragStart;
    this.onDragUpdate = onDragUpdate;
  }

  createState(): State<StatefulWidget> {
    return new BaseNodeState();
  }
}

class BaseNodeState extends State<baseNode> {
  key!: GlobalKey;
  eventManager!: EventManager;
  controller!: DiagramController;
  override initState(context: Element): void {
    super.initState(context);
    this.eventManager = EventManagerProvider.of(context);
    this.controller = DiagramControllerProvider.of(context);
    this.key = new GlobalKey();

    this.eventManager.dispatchEvent(
      new NodeInsertEvent({ key: this.key, tableName: this.widget.table.name }),
    );
  }

  override dispose(): void {
    super.dispose();
    this.eventManager.dispatchEvent(
      new NodeRemoveEvent({ tableName: this.widget.table.name }),
    );
  }

  private dispatchActiveEvent(active: boolean) {
    const relatedFields = this.controller.getRelatedFieldIdsByTableId(
      this.widget.table.id,
    );
    relatedFields.forEach((field) => {
      this.eventManager.dispatchEvent(
        new ActiveRelationEvent({ field, active }),
      );
    });
  }

  handleMouseEnter = () => {
    if (
      this.controller.isDragging &&
      !this.controller.isDraggingTarget(this.widget.table.name)
    )
      return;
    this.dispatchActiveEvent(true);
  };

  handleMouseLeave = () => {
    if (this.controller.isDragging) return;
    this.dispatchActiveEvent(false);
  };

  handleDragStart = () => {
    this.widget.onDragStart?.();
    this.controller.setActiveDragging(this.widget.table.name);
  };

  handleDragEnd = () => {
    this.widget.onDragEnd?.();
    this.controller.setActiveDragging(null);
    this.eventManager.dispatchEvent(
      new NodeTranslationEndEvent({ tableName: this.widget.table.name }),
    );
  };

  handleDrag = (event: { movement: Offset; delta: Offset }) => {
    this.widget.onDragUpdate?.(event);
    this.eventManager.dispatchEvent(
      new NodeTranslationEvent({
        tableName: this.widget.table.name,
        translation: this.controller.getTranslation(event.movement),
      }),
    );
  };

  handleChangeSize = () => {
    this.eventManager.dispatchEvent(
      new NodeLayoutChangeEvent({
        tableName: this.widget.table.name,
        key: this.key,
      }),
    );
  };

  build() {
    const {
      table: { fields, name },
    } = this.widget;
    return ChangedLayoutNotifier({
      onChange: this.handleChangeSize,
      child: GestureDetector({
        key: this.key,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        bubble: {
          wheel: true,
        },
        child: Container({
          decoration: new BoxDecoration({
            color: "#707070",
            border: Border.all({ color: "black", width: 1 }),
          }),
          child: ConstraintsTransformBox({
            constraintsTransform: (constraints) =>
              new Constraints({ ...constraints, minWidth: 200 }),
            child: IntrinsicWidth({
              child: Column({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container({
                    decoration: new BoxDecoration({
                      color: "#505050",
                      border: new Border({
                        bottom: new BorderSide({
                          color: "black",
                          width: 1,
                        }),
                      }),
                    }),
                    child: Draggable({
                      onDragStart: this.handleDragStart,
                      onDragEnd: this.handleDragEnd,
                      onDragUpdate: this.handleDrag,
                      child: Padding({
                        padding: EdgeInsets.symmetric({
                          horizontal: 8,
                          vertical: 8,
                        }),
                        child: Row({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(name, {
                              style: new TextStyle({
                                color: "lightgrey",
                                fontWeight: "800",
                                fontFamily: "Noto Sans KR, sans-serif",
                              }),
                            }),
                          ],
                        }),
                      }),
                    }),
                  }),
                  ...fields.map((field) => Field({ field })),
                ],
              }),
            }),
          }),
        }),
      }),
    });
  }
}

export default classToFunction(baseNode);
