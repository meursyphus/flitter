import { ChangeNotifier } from "flitter-core";
import type { LineChartCustom, LineChartData, LineChartScale, GetScaleFn, GetScaleOptionsFn } from "./types";

export class LineChartController extends ChangeNotifier {
  #rawData: LineChartData;
  #hiddenSeries: Set<string> = new Set();
  #hoveredPoint: { index: number; legend: string } | null = null;
  #scale: LineChartScale | null = null;
  #getScale: GetScaleFn;
  #getScaleOptions: GetScaleOptionsFn | null;
  #width: number = 0;
  #height: number = 0;

  // static config
  custom!: LineChartCustom<any>;
  config: any;

  constructor({
    data,
    getScale,
    getScaleOptions = null,
    custom,
    config = {},
  }: {
    data: LineChartData;
    getScale: GetScaleFn;
    getScaleOptions?: GetScaleOptionsFn | null;
    custom: LineChartCustom<any>;
    config?: any;
  }) {
    super();
    this.#rawData = data;
    this.#getScale = getScale;
    this.#getScaleOptions = getScaleOptions;
    this.custom = custom;
    this.config = config;
  }

  // --- internal scale 재계산 ---

  #recalcScale(): void {
    const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
    this.#scale = this.#getScale(this.data, options);
  }

  // --- data ---

  set data(value: LineChartData) {
    this.#rawData = value;
    this.#recalcScale();
    this.notifyListeners();
  }

  get data(): LineChartData {
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

  get scale(): LineChartScale | null {
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
    this.#recalcScale();
    this.notifyListeners();
  }

  showSeries(legend: string): void {
    if (!this.#hiddenSeries.has(legend)) return;
    this.#hiddenSeries.delete(legend);
    this.#recalcScale();
    this.notifyListeners();
  }

  hideSeries(legend: string): void {
    if (this.#hiddenSeries.has(legend)) return;
    this.#hiddenSeries.add(legend);
    this.#recalcScale();
    this.notifyListeners();
  }

  showAllSeries(): void {
    if (this.#hiddenSeries.size === 0) return;
    this.#hiddenSeries.clear();
    this.#recalcScale();
    this.notifyListeners();
  }

  // --- 호버 ---

  get hoveredPoint(): { index: number; legend: string } | null {
    return this.#hoveredPoint;
  }

  hoverPoint(index: number, legend: string): void {
    this.#hoveredPoint = { index, legend };
    this.notifyListeners();
  }

  unhoverPoint(): void {
    if (this.#hoveredPoint === null) return;
    this.#hoveredPoint = null;
    this.notifyListeners();
  }

  isPointHovered(index: number, legend: string): boolean {
    return (
      this.#hoveredPoint?.index === index && this.#hoveredPoint?.legend === legend
    );
  }
}
