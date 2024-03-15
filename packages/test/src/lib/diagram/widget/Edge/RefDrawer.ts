import {
  Element,
  GlobalKey,
  Stack,
  State,
  StatefulWidget,
  Widget,
} from "@meursyphus/flitter";
import DiagramControllerProvider from "../Provider/DiagramControllerProvider";
import { classToFunction } from "../utils";
import Edge from "./Edge";
import type { DiagramController } from "../../controller";
import type { FieldId } from "../../type";
import { FieldInsertEvent, FieldRemoveEvent } from "../../event/field";
import type { EventManager } from "../../event";
import { EventManagerProvider } from "../Provider";

class RefDrawer extends StatefulWidget {
  createState(): State<StatefulWidget> {
    return new RefDrawerState();
  }
}

class RefDrawerState extends State<RefDrawer> {
  fields: Record<FieldId, GlobalKey> = {};
  controller!: DiagramController;
  eventManager!: EventManager;
  initState(context: Element): void {
    super.initState(context);
    this.controller = DiagramControllerProvider.of(context);
    this.eventManager = EventManagerProvider.of(context);
    this.eventManager.addEventListener(
      FieldInsertEvent.type,
      this.handleFieldInsert,
    );
    this.eventManager.addEventListener(
      FieldRemoveEvent.type,
      this.handleFieldRemove,
    );
  }

  handleFieldInsert = (e: FieldInsertEvent) => {
    this.fields[e.id] = e.key;
  };

  handleFieldRemove = (e: FieldRemoveEvent) => {
    delete this.fields[e.id];
  };

  build(): Widget {
    const relatedFields = this.controller.getAllRelatedFields();
    return Stack({
      children: relatedFields.map(({ from, to }) =>
        Edge({ from, to, fields: this.fields }),
      ),
    });
  }
}

export default classToFunction(RefDrawer);
