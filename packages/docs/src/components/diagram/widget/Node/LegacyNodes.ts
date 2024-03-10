import {
  Element,
  Offset,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Widget,
} from "@moonmoonbrothers/flutterjs";
import DiagramControllerProvider from "../Provider/DiagramControllerProvider";
import { LegacyNodeEvent, type EventManager } from "../../event";
import EventManagerProvider from "../Provider/EventManagerProvider";
import type { Table } from "../../type";
import LegacyNode from "./LegacyNode";
import { classToFunction } from "../utils";
import type { DiagramController } from "../../controller";

class MovedNodes extends StatefulWidget {
  createState(): State<StatefulWidget> {
    return new StateMovedNodes();
  }
}

type TableName = string;

class StateMovedNodes extends State<MovedNodes> {
  controller!: DiagramController;
  eventManager!: EventManager;
  legacyNodes: Record<TableName, Offset> = {};

  initState(context: Element): void {
    this.controller = DiagramControllerProvider.of(context);
    this.eventManager = EventManagerProvider.of(context);
    this.eventManager.addEventListener(
      LegacyNodeEvent.type,
      this.handleLegacyNode,
    );
  }

  handleLegacyNode = (e: LegacyNodeEvent) => {
    this.setState(() => {
      const rect = this.controller.getRect(e.key);
      this.legacyNodes[e.tableName] = new Offset({ x: rect.left, y: rect.top });
    });
  };

  getLegacyTables(): { table: Table; position: Offset }[] {
    const result: { table: Table; position: Offset }[] = [];
    Object.entries(this.legacyNodes).forEach(([tableName, position]) => {
      const table = this.controller.getTableByName(tableName);
      if (table == null) return;
      result.push({
        table,
        position,
      });
    });
    return result;
  }

  handlePositionChange = (tableName: string) => (position: Offset) => {
    this.legacyNodes[tableName] = position;
  };

  override build(_context: Element): Widget {
    const tables = this.getLegacyTables();
    return Stack({
      fit: StackFit.loose,
      children: tables.map(({ table, position }) =>
        LegacyNode({
          key: table.name,
          table,
          position,
          onPositionChange: this.handlePositionChange(table.name),
        }),
      ),
    });
  }
}

export default classToFunction(MovedNodes);
