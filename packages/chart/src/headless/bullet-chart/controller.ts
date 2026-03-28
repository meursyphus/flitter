import { ChangeNotifier } from "flitter-core";
import type { BulletChartCustom, BulletChartData, BulletChartScale, GetScaleFn, GetScaleOptionsFn } from "./types";

export class BulletChartController extends ChangeNotifier {
  #rawData: BulletChartData;
  #hoveredBullet: number | null = null;
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
    custom,
    config = {},
  }: {
    data: BulletChartData;
    getScale: GetScaleFn;
    getScaleOptions?: GetScaleOptionsFn | null;
    custom: BulletChartCustom<any>;
    config?: any;
  }) {
    super();
    this.#rawData = data;
    this.#getScale = getScale;
    this.#getScaleOptions = getScaleOptions;
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
    this.#recalcScale();
    this.notifyListeners();
  }

  get data(): BulletChartData {
    return this.#rawData;
  }

  get legends(): string[] {
    return this.#rawData.labels;
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

  get hoveredBullet(): number | null {
    return this.#hoveredBullet;
  }

  hoverBullet(index: number): void {
    this.#hoveredBullet = index;
    this.notifyListeners();
  }

  unhoverBullet(): void {
    if (this.#hoveredBullet === null) return;
    this.#hoveredBullet = null;
    this.notifyListeners();
  }

  isBulletHovered(index: number): boolean {
    return this.#hoveredBullet === index;
  }

  // --- legend compatibility (no-op, bullet chart has no series toggling) ---

  isSeriesVisible(_legend: string): boolean {
    return true;
  }

  toggleSeries(_legend: string): void {
    // no-op
  }
}
