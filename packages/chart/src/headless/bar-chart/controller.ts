import { ChangeNotifier } from "flitter-core";
import type { BarChartData, BarChartScale } from "./types";

export class BarChartController extends ChangeNotifier {
  #data: BarChartData;
  #getScale: (data: BarChartData) => BarChartScale;
  #hiddenSeries: Set<string> = new Set();
  #hoveredBar: { index: number; legend: string } | null = null;

  constructor({
    data,
    getScale,
  }: {
    data: BarChartData;
    getScale: (data: BarChartData) => BarChartScale;
  }) {
    super();
    this.#data = data;
    this.#getScale = getScale;
  }

  // --- 원본 데이터 ---

  get data(): BarChartData {
    return this.#data;
  }

  set data(value: BarChartData) {
    this.#data = value;
    this.notifyListeners();
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
    this.notifyListeners();
  }

  showSeries(legend: string): void {
    if (!this.#hiddenSeries.has(legend)) return;
    this.#hiddenSeries.delete(legend);
    this.notifyListeners();
  }

  hideSeries(legend: string): void {
    if (this.#hiddenSeries.has(legend)) return;
    this.#hiddenSeries.add(legend);
    this.notifyListeners();
  }

  showAllSeries(): void {
    if (this.#hiddenSeries.size === 0) return;
    this.#hiddenSeries.clear();
    this.notifyListeners();
  }

  // --- 파생 데이터 ---

  get visibleData(): BarChartData {
    return {
      labels: this.#data.labels,
      datasets: this.#data.datasets.filter(
        (d) => !this.#hiddenSeries.has(d.legend),
      ),
    };
  }

  get visibleScale(): BarChartScale {
    return this.#getScale(this.visibleData);
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
