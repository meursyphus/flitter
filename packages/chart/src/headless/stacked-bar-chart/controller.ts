import { ChangeNotifier } from "flitter-core";
import type { StackedBarChartCustom, StackedBarChartData, StackedBarChartDirection, StackedBarChartScale, GetScaleFn, GetScaleOptionsFn } from "./types";

export class StackedBarChartController extends ChangeNotifier {
  #rawData: StackedBarChartData;
  #direction: StackedBarChartDirection;
  #hiddenSeries: Set<string> = new Set();
  #hoveredBar: { index: number; legend: string } | null = null;
  #scale: StackedBarChartScale | null = null;
  #getScale: GetScaleFn;
  #getScaleOptions: GetScaleOptionsFn | null;
  #width: number = 0;
  #height: number = 0;

  // static config
  custom!: StackedBarChartCustom<any>;
  title: string;
  config: any;

  constructor({
    data,
    getScale,
    getScaleOptions = null,
    direction = "vertical",
    custom,
    title = "",
    config = {},
  }: {
    data: StackedBarChartData;
    getScale: GetScaleFn;
    getScaleOptions?: GetScaleOptionsFn | null;
    direction?: StackedBarChartDirection;
    custom: StackedBarChartCustom<any>;
    title?: string;
    config?: any;
  }) {
    super();
    this.#rawData = data;
    this.#getScale = getScale;
    this.#getScaleOptions = getScaleOptions;
    this.#direction = direction;
    this.custom = custom;
    this.title = title;
    this.config = config;
  }

  // --- internal scale 재계산 ---

  #recalcScale(): void {
    const options = this.#getScaleOptions?.(this) ?? { roughStepCount: 10 };
    this.#scale = this.#getScale(this.data, options);
  }

  // --- data ---

  set data(value: StackedBarChartData) {
    this.#rawData = value;
    this.#recalcScale();
    this.notifyListeners();
  }

  get data(): StackedBarChartData {
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

  get direction(): StackedBarChartDirection {
    return this.#direction;
  }

  set direction(value: StackedBarChartDirection) {
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

  get scale(): StackedBarChartScale | null {
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

  get hoveredBar(): { index: number; legend: string } | null {
    return this.#hoveredBar;
  }

  hoverBar(index: number, legend: string): void {
    this.#hoveredBar = { index, legend };
    this.notifyListeners();
  }

  unhoverBar(): void {
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
