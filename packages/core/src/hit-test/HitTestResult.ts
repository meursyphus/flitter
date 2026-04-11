import type { RenderObject } from "../renderobject/RenderObject";

export class HitTestEntry {
  readonly target: RenderObject;
  constructor(target: RenderObject) {
    this.target = target;
  }
}

export class HitTestResult {
  readonly path: HitTestEntry[] = [];

  add(entry: HitTestEntry): void {
    this.path.push(entry);
  }
}
