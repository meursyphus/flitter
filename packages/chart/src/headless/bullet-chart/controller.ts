import { ChangeNotifier, GlobalKey } from "flitter-core";
import type {
  BulletChartCustom,
  BulletChartData,
  BulletChartDirection,
  BulletChartScale,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";

export class BulletChartController extends ChangeNotifier {
  #rawData: BulletChartData;
  #direction: BulletChartDirection;
  #hoveredBullet: { index: number; anchorKey: GlobalKey } | null = null;
  #scale: BulletChartScale | null = null;
  #getScale: GetScaleFn;
  #getScaleOptions: GetScaleOptionsFn | null;
  #width: number = 0;
  #height: number = 0;

  // static config
  custom!: BulletChartCustom<any>;
  config: any;

  constructor({
    data,
    getScale,
    getScaleOptions = null,
    direction = "horizontal",
    custom,
    config = {},
  }: {
    data: BulletChartData;
    getScale: GetScaleFn;
    getScaleOptions?: GetScaleOptionsFn | null;
    direction?: BulletChartDirection;
    custom: BulletChartCustom<any>;
    config?: any;
  }) {
    super();
    this.#rawData = data;
    this.#getScale = getScale;
    this.#getScaleOptions = getScaleOptions;
    this.#direction = direction;
    this.custom = custom;
    this.config = config;
  }

  // --- internal scale recalculation ---

  #recalcScale(): void {
    const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
    this.#scale = this.#getScale(this.data, options);
  }

  // --- data ---

  set data(value: BulletChartData) {
    this.#rawData = value;
    this.#hoveredBullet = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  get data(): BulletChartData {
    return this.#rawData;
  }

  get legends(): string[] {
    return this.#rawData.labels;
  }

  get direction(): BulletChartDirection {
    return this.#direction;
  }

  set direction(value: BulletChartDirection) {
    if (this.#direction === value) return;
    this.#direction = value;
    this.#hoveredBullet = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  // --- chart size ---

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  setSize(width: number, height: number): void {
    if (this.#width === width && this.#height === height) return;
    this.#width = width;
    this.#height = height;
    this.#recalcScale();
    this.notifyListeners();
  }

  // --- scale ---

  get scale(): BulletChartScale | null {
    return this.#scale;
  }

  // --- hover ---

  get hoveredBullet(): { index: number; anchorKey: GlobalKey } | null {
    return this.#hoveredBullet;
  }

  hoverBullet(index: number, anchorKey: GlobalKey): void {
    if (
      this.#hoveredBullet?.index === index &&
      this.#hoveredBullet?.anchorKey === anchorKey
    ) {
      return;
    }

    this.#hoveredBullet = { index, anchorKey };
    this.notifyListeners();
  }

  unhoverBullet(index?: number): void {
    if (this.#hoveredBullet === null) return;
    if (index != null && this.#hoveredBullet.index !== index) return;
    this.#hoveredBullet = null;
    this.notifyListeners();
  }

  isBulletHovered(index: number): boolean {
    return this.#hoveredBullet?.index === index;
  }

  // --- legend compatibility (no-op, bullet chart has no series toggling) ---

  isSeriesVisible(_legend: string): boolean {
    return true;
  }

  toggleSeries(_legend: string): void {
    // no-op
  }
}
