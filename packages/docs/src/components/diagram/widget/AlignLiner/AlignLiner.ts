import type { DiagramController } from "../../controller";
import {
  type EventManager,
  NodeInsertEvent,
  NodeRemoveEvent,
  NodeTranslationEvent,
  NodeTranslationEndEvent,
  NodeAlignTranslationEvent,
  NodeLayoutChangeEvent,
} from "../../event";
import {
  BuildContext,
  Offset,
  Positioned,
  Stack,
  State,
  StatefulWidget,
  ZIndex,
} from "@meursyphus/flitter";
import { DiagramControllerProvider, EventManagerProvider } from "../Provider";
import type { Line as LineProps } from "./type";
import Line from "./Line";
import { classToFunction } from "../utils";
import getNextZIndex from "../getNextZIndex";

class AlignLiner extends StatefulWidget {
  createState(): State<StatefulWidget> {
    return new AlignLinerState();
  }
}

type TableName = string;

type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

class AlignLinerState extends State<AlignLiner> {
  controller!: DiagramController;
  eventManager!: EventManager;
  rects: Record<TableName, Rect> = {};
  lines: LineProps[] = [];
  addPostFrameCallback!: (callback: () => void) => void;

  initState(context: BuildContext): void {
    this.addPostFrameCallback = context.scheduler.addPostFrameCallbacks.bind(
      context.scheduler,
    );
    this.controller = DiagramControllerProvider.of(context);
    this.eventManager = EventManagerProvider.of(context);

    this.eventManager.addEventListener(
      NodeTranslationEvent.type,
      this.handleNodeTranslation,
    );
    this.eventManager.addEventListener(
      NodeRemoveEvent.type,
      this.handleNodeRemove,
    );
    this.eventManager.addEventListener(
      NodeInsertEvent.type,
      this.handleNodeInsert,
    );
    this.eventManager.addEventListener(
      NodeTranslationEndEvent.type,
      this.handleNodeTranslationEnd,
    );
    this.eventManager.addEventListener(
      NodeLayoutChangeEvent.type,
      this.handleNodeLayoutChange,
    );
  }

  dispose(): void {
    super.dispose();
    this.eventManager.removeEventListener(
      NodeLayoutChangeEvent.type,
      this.handleNodeLayoutChange,
    );
    this.eventManager.removeEventListener(
      NodeTranslationEvent.type,
      this.handleNodeTranslation,
    );
    this.eventManager.removeEventListener(
      NodeRemoveEvent.type,
      this.handleNodeRemove,
    );
    this.eventManager.removeEventListener(
      NodeInsertEvent.type,
      this.handleNodeInsert,
    );
    this.eventManager.removeEventListener(
      NodeTranslationEndEvent.type,
      this.handleNodeTranslationEnd,
    );
  }

  handleNodeLayoutChange = (e: NodeLayoutChangeEvent) => {
    const rect = this.controller.getRect(e.key);
    this.rects[e.tableName] = {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    };
  };

  handleNodeTranslation = (e: NodeTranslationEvent) => {
    this.addPostFrameCallback(() => {
      this.changeLiners(e.tableName);
    });
  };

  handleNodeRemove = (e: NodeRemoveEvent) => {
    delete this.rects[e.tableName];
  };

  handleNodeInsert = (e: NodeInsertEvent) => {
    /**
     * 노드가 레거시화 되는 순간, 해당 노드의 랜더트리 위치가 바뀌는 과정에서 불필요하게 dispose와 initState가 다시 발생한다.
     * 이는 flutterjs에서 같은 키를 가진 위젯의 lazy dispose를 구현하지 않아서 발생하는 문제이다.
     * 위의 문제 때문에 dispose와 initState의 불필요한 호출이 발생되고, 해당 메서드의 순서가 보장되지 않아 NodeInsertEvent가 NodeRemoveEvent보다 먼저 발생할 수 있다.
     * 그럴 경우 this.findRect(e.tableName)에서 null 에러가 발생한다.
     * 이를 방지하기위해 임시적으로 setTimeout을 사용해 동작순서를 강제루 미룬다.
     * setTimeout은 flutterjs의 해당 이슈가 해결되면 사라질 예정이다.
     * @see https://github.com/moonmoonbrothers/uglychart/issues/204
     */
    setTimeout(() => {
      this.addPostFrameCallback(() => {
        const rect = this.controller.getRect(e.key);
        this.rects[e.tableName] = {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        };
      });
    }, 0);
  };

  handleNodeTranslationEnd = (_: NodeTranslationEndEvent) => {
    this.setState(() => {
      this.lines = [];

      const [dx, dy] = [this.translationX, this.translationY];
      const target = this.targetName;
      this.translationX = 0;
      this.translationY = 0;
      this.targetName = null;
      if (dx !== 0 || dy !== 0) {
        /**
         * legacy node가 mount되고 난 뒤 이벤트 발행
         */
        this.addPostFrameCallback(() => {
          this.eventManager.dispatchEvent(
            new NodeAlignTranslationEvent({
              tableName: target!,
              translation: new Offset({ x: dx, y: dy }),
            }),
          );
        });
      }
    });
  };

  translationX = 0;
  translationY = 0;
  targetName: TableName | null = null;
  private changeLiners(target: TableName) {
    this.targetName = target;
    this.setState(() => {
      this.lines = [];
      const targetRect = this.findRect(target);
      const otherRects = this.getAllRectsExceptTarget(target);

      let isXAlign = false;
      let isYAlign = false;
      otherRects.forEach((rect) => {
        if (this.isInRange(rect.right, targetRect.right)) {
          this.lines.push({ type: "vertical", x: rect.right });
          this.translationX = rect.right - targetRect.right;
          isXAlign = true;
        }
        if (this.isInRange(rect.bottom, targetRect.bottom)) {
          this.lines.push({ type: "horizontal", y: rect.bottom });
          this.translationY = rect.bottom - targetRect.bottom;
          isYAlign = true;
        }
        if (this.isInRange(rect.left, targetRect.left)) {
          this.lines.push({ type: "vertical", x: rect.left });
          this.translationX = rect.left - targetRect.left;
          isXAlign = true;
        }
        if (this.isInRange(rect.top, targetRect.top)) {
          this.lines.push({ type: "horizontal", y: rect.top });
          this.translationY = rect.top - targetRect.top;
          isYAlign = true;
        }
      });
      if (!isXAlign) {
        this.translationX = 0;
      }
      if (!isYAlign) {
        this.translationY = 0;
      }
    });
  }

  private isInRange(target: number, criteria: number) {
    return Math.abs(target - criteria) < 5;
  }

  private getAllRectsExceptTarget(target: TableName): Rect[] {
    const result: Rect[] = [];

    Object.entries(this.rects).forEach(([tableName, rect]) => {
      if (tableName === target) return;
      result.push(rect);
    });
    return result;
  }

  private findRect(tableName: string) {
    const result = this.rects[tableName];
    if (result == null)
      throw new Error(`Cannot find rect for ${tableName} on AlignLiner`);

    return result;
  }

  override build() {
    return ZIndex({
      zIndex: getNextZIndex(),
      child: Stack({
        children: this.lines.map((line) =>
          Positioned.fill({ child: Line({ line }) }),
        ),
      }),
    });
  }
}

export default classToFunction(AlignLiner);
