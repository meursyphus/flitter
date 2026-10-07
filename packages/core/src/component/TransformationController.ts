import ChangeNotifier from "../provider/ChangeNotifier";
import { Matrix4, Offset } from "../type";

/** Assign a new matrix (or a clone) to notify viewers after a transform change. */
export default class TransformationController extends ChangeNotifier {
  private matrix: Matrix4;
  private listenersToDispose = new Set<() => void>();
  private disposed = false;
  constructor(value = Matrix4.identity()) {
    super();
    this.matrix = value;
  }
  get value(): Matrix4 {
    return this.matrix;
  }
  set value(value: Matrix4) {
    if (this.disposed) throw new Error("TransformationController is disposed");
    if (value === this.matrix) return;
    this.matrix = value;
    this.notifyListeners();
  }
  toScene(viewportPoint: Offset): Offset {
    const inverse = Matrix4.identity();
    if (inverse.copyInverse(this.value) === 0)
      throw new Error("Cannot invert a singular transformation.");
    return transformPoint(inverse, viewportPoint);
  }
  toViewport(scenePoint: Offset): Offset {
    return transformPoint(this.value, scenePoint);
  }
  override addListener(listener: () => void): void {
    if (this.disposed || this.listenersToDispose.has(listener)) return;
    this.listenersToDispose.add(listener);
    super.addListener(listener);
  }
  override removeListener(listener: () => void): void {
    this.listenersToDispose.delete(listener);
    super.removeListener(listener);
  }
  dispose(): void {
    for (const listener of this.listenersToDispose)
      super.removeListener(listener);
    this.listenersToDispose.clear();
    this.disposed = true;
  }
}

export function transformPoint(matrix: Matrix4, point: Offset): Offset {
  const m = matrix.storage;
  const w = m[3] * point.x + m[7] * point.y + m[15];
  return new Offset({
    x: (m[0] * point.x + m[4] * point.y + m[12]) / w,
    y: (m[1] * point.x + m[5] * point.y + m[13]) / w,
  });
}
