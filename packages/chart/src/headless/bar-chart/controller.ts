import { ChangeNotifier, GlobalKey } from "flitter-core";
import type { BarChartCustom, BarChartData, BarChartDirection, BarChartScale, GetScaleFn, GetScaleOptionsFn } from "./types";

export class BarChartController extends ChangeNotifier {
  #rawData: BarChartData;
  #direction: BarChartDirection;
  #hiddenSeries: Set<string> = new Set();
  #hoveredBar: { index: number; legend: string; anchorKey: GlobalKey } | null = null;
  #scale: BarChartScale | null = null;
  #getScale: GetScaleFn;
  #getScaleOptions: GetScaleOptionsFn | null;
  #width: number = 0;
  #height: number = 0;

  // static config
  custom!: BarChartCustom<any>;
  config: any;

  constructor({
    data,
    getScale,
    getScaleOptions = null,
    direction = "vertical",
    custom,
    config = {},
  }: {
    data: BarChartData;
    getScale: GetScaleFn;
    getScaleOptions?: GetScaleOptionsFn | null;
    direction?: BarChartDirection;
    custom: BarChartCustom<any>;
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

  // --- internal scale 재계산 (notify 안 함) ---

  #recalcScale(): void {
    const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
    this.#scale = this.#getScale(this.data, options);
  }

  // --- data ---

  set data(value: BarChartData) {
    this.#rawData = value;
    this.#hoveredBar = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  get data(): BarChartData {
    return {
      labels: this.#rawData.labels,
      datasets: this.#rawData.datasets.filter(
        (d) => !this.#hiddenSeries.has(d.legend),
      ),
    };
  }

  get legends(): string[] {
    return this.#rawData.datasets.map((d) => d.legend);
  }

  // --- direction ---

  get direction(): BarChartDirection {
    return this.#direction;
  }

  set direction(value: BarChartDirection) {
    if (this.#direction === value) return;
    this.#direction = value;
    this.#recalcScale();
    this.notifyListeners();
  }

  // --- 차트 크기 ---

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

  get scale(): BarChartScale | null {
    return this.#scale;
  }

  // --- 레전드 필터 ---

  get hiddenSeries(): ReadonlySet<string> {
    return this.#hiddenSeries;
  }

  isSeriesVisible(legend: string): boolean {
    return !this.#hiddenSeries.has(legend);
  }

  toggleSeries(legend: string): void {
    if (this.#hiddenSeries.has(legend)) {
      this.#hiddenSeries.delete(legend);
    } else {
      this.#hiddenSeries.add(legend);
    }
    this.#hoveredBar = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  showSeries(legend: string): void {
    if (!this.#hiddenSeries.has(legend)) return;
    this.#hiddenSeries.delete(legend);
    this.#hoveredBar = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  hideSeries(legend: string): void {
    if (this.#hiddenSeries.has(legend)) return;
    this.#hiddenSeries.add(legend);
    this.#hoveredBar = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  showAllSeries(): void {
    if (this.#hiddenSeries.size === 0) return;
    this.#hiddenSeries.clear();
    this.#hoveredBar = null;
    this.#recalcScale();
    this.notifyListeners();
  }

  // --- 호버 ---

  get hoveredBar(): { index: number; legend: string; anchorKey: GlobalKey } | null {
    return this.#hoveredBar;
  }

  hoverBar(index: number, legend: string, anchorKey: GlobalKey): void {
    this.#hoveredBar = { index, legend, anchorKey };
    this.notifyListeners();
  }

  unhoverBar(index: number, legend: string): void {
    if (this.#hoveredBar === null) return;
    if (this.#hoveredBar.index !== index || this.#hoveredBar.legend !== legend) return;
    this.#hoveredBar = null;
    this.notifyListeners();
  }

  unhoverAllBars(): void {
    if (this.#hoveredBar === null) return;
    this.#hoveredBar = null;
    this.notifyListeners();
  }

  isBarHovered(index: number, legend: string): boolean {
    return (
      this.#hoveredBar?.index === index && this.#hoveredBar?.legend === legend
    );
  }
}
