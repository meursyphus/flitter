import { ChangeNotifier } from "flitter-core";
import type { StackedAreaChartCustom, StackedAreaChartData, StackedAreaChartScale, GetScaleFn, GetScaleOptionsFn } from "./types";

export class StackedAreaChartController extends ChangeNotifier {
  #rawData: StackedAreaChartData;
  #hiddenSeries: Set<string> = new Set();
  #hoveredPoint: { index: number; legend: string } | null = null;
  #scale: StackedAreaChartScale | null = null;
  #getScale: GetScaleFn;
  #getScaleOptions: GetScaleOptionsFn | null;
  #width: number = 0;
  #height: number = 0;

  // static config
  custom!: StackedAreaChartCustom<any>;
  config: any;

  constructor({
    data,
    getScale,
    getScaleOptions = null,
    custom,
    config = {},
  }: {
    data: StackedAreaChartData;
    getScale: GetScaleFn;
    getScaleOptions?: GetScaleOptionsFn | null;
    custom: StackedAreaChartCustom<any>;
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

  set data(value: StackedAreaChartData) {
    this.#rawData = value;
    this.#recalcScale();
    this.notifyListeners();
  }

  get data(): StackedAreaChartData {
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

  get scale(): StackedAreaChartScale | null {
    return this.#scale;
  }

  // --- legend filter ---

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

  // --- hover ---

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
