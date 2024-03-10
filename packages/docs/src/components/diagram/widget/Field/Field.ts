import {
  SizedBox,
  StatefulWidget,
  State,
  BuildContext,
  GlobalKey,
  Tooltip,
  ToolTipPosition,
  GestureDetector,
} from "@moonmoonbrothers/flutterjs";
import type { Field as FieldProps } from "../../type";
import { classToFunction } from "../utils";
import ChangedLayoutNotifier from "../ChangeNotifier/ChangedLayoutNotifier";
import {
  FieldLayoutChangeEvent,
  type EventManager,
  ActiveRelationEvent,
} from "../../event";
import EventManagerProvider from "../Provider/EventManagerProvider";
import NoteTooltip from "./NoteTooltip";
import FieldContent from "./FieldContent";
import FakeIntrinsicWidth from "./FakeIntrinsicWidth";
import DiagramControllerProvider from "../Provider/DiagramControllerProvider";
import type { DiagramController } from "../../controller";
import { FieldInsertEvent, FieldRemoveEvent } from "../../event/field";

class Field extends StatefulWidget {
  field: FieldProps;
  constructor({ field }: { field: FieldProps }) {
    super(field.id);
    this.field = field;
  }

  createState(): State<StatefulWidget> {
    return new FieldState();
  }
}

class FieldState extends State<Field> {
  key!: GlobalKey;
  eventManager!: EventManager;
  controller!: DiagramController;
  active: boolean = false;

  override initState(context: BuildContext): void {
    super.initState(context);
    this.key = new GlobalKey();
    this.eventManager = EventManagerProvider.of(context);
    this.controller = DiagramControllerProvider.of(context);

    this.eventManager.addEventListener(
      ActiveRelationEvent.type,
      this.handleActiveRelationEvent,
    );
    this.eventManager.dispatchEvent(
      new FieldInsertEvent({ id: this.widget.field.id, key: this.key }),
    );
  }

  override dispose(): void {
    super.dispose();
    this.eventManager.removeEventListener(
      ActiveRelationEvent.type,
      this.handleActiveRelationEvent,
    );
    this.eventManager.dispatchEvent(
      new FieldRemoveEvent({ id: this.widget.field.id }),
    );
  }

  dispatchFieldLayoutChangeEvent = () => {
    this.eventManager.dispatchEvent(
      new FieldLayoutChangeEvent({ id: this.widget.field.id, key: this.key }),
    );
  };

  handleActiveRelationEvent = (e: ActiveRelationEvent) => {
    const id = this.widget.field.id;
    if (e.field.from !== id && e.field.to !== id) return;
    this.setState(() => {
      this.active = e.active;
    });
  };

  handleMouseEnter = () => {
    if (this.controller.isDragging) return;
    this.setState(() => {
      this.active = true;
    });
  };

  handleMouseLeave = () => {
    if (this.controller.isDragging) return;
    this.setState(() => {
      this.active = false;
    });
  };

  build(_: BuildContext) {
    const {
      field: {
        name,
        type: { typeName },
        note,
        default: defaultValue,
      },
    } = this.widget;

    return ChangedLayoutNotifier({
      onChange: () => {
        this.dispatchFieldLayoutChangeEvent();
      },
      child: GestureDetector({
        key: this.key,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        bubble: {
          mouseenter: true,
          mouseleave: true,
          wheel: true,
        },
        child: Tooltip({
          position: ToolTipPosition.bottomRight,
          child: FieldContent({
            field: this.widget.field,
            active: this.active,
          }),
          tooltip:
            (note || defaultValue != null) && !this.controller.isDragging
              ? FakeIntrinsicWidth({
                  child: NoteTooltip({
                    name,
                    type: typeName,
                    note: note,
                    defaultValue: defaultValue,
                  }),
                })
              : SizedBox.shrink(),
        }),
      }),
    });
  }
}

export default classToFunction(Field);
