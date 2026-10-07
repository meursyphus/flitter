import { ChangeNotifier } from "flitter-core";
import type { FunnelChartCustom, FunnelChartData, FunnelStage } from "./types";

function normalize(data: FunnelChartData): FunnelChartData {
  return {
    stages: data.stages.map(({ label, value }) => ({
      label,
      value: Number.isFinite(value) ? Math.max(0, value) : 0,
    })),
  };
}

export class FunnelChartController<
  TConfig extends object = object,
> extends ChangeNotifier {
  #data: FunnelChartData;
  #hidden = new Set<number>();
  #hoveredIndex: number | null = null;
  custom: FunnelChartCustom<TConfig>;
  config: TConfig;

  constructor({
    data,
    custom,
    config,
  }: {
    data: FunnelChartData;
    custom: FunnelChartCustom<TConfig>;
    config: TConfig;
  }) {
    super();
    this.#data = normalize(data);
    this.custom = custom;
    this.config = config;
  }

  get data(): FunnelChartData {
    return this.#data;
  }
  get hoveredIndex(): number | null {
    return this.#hoveredIndex;
  }
  get hoveredStage(): FunnelStage | null {
    return (
      this.stages.find((stage) => stage.index === this.#hoveredIndex) ?? null
    );
  }

  get stages(): FunnelStage[] {
    const maximum = Math.max(
      0,
      ...this.#data.stages.map((stage) => stage.value),
    );
    if (maximum === 0) return [];
    const first = this.#data.stages[0]?.value ?? 0;
    const visible = this.#data.stages
      .map((stage, index) => ({ ...stage, index }))
      .filter((stage) => !this.#hidden.has(stage.index));
    return visible.map((stage, position) => {
      const previous = this.#data.stages[stage.index - 1]?.value;
      return {
        ...stage,
        percentage: first > 0 ? (stage.value / first) * 100 : 0,
        conversion:
          previous != null && previous > 0
            ? (stage.value / previous) * 100
            : null,
        top: position / visible.length,
        height: 1 / visible.length,
        topWidth: stage.value / maximum,
        bottomWidth: (visible[position + 1]?.value ?? stage.value) / maximum,
      };
    });
  }

  update({
    data,
    custom,
    config,
  }: {
    data: FunnelChartData;
    custom: FunnelChartCustom<TConfig>;
    config: TConfig;
  }): void {
    const next = normalize(data);
    // A replacement dataset must not inherit hidden stages by array position.
    this.#hidden = new Set(
      [...this.#hidden].filter(
        (index) =>
          next.stages[index]?.label === this.#data.stages[index]?.label,
      ),
    );
    this.#data = next;
    this.custom = custom;
    this.config = config;
    this.#hoveredIndex = null;
    this.notifyListeners();
  }

  isStageVisible(index: number): boolean {
    return this.#data.stages[index] != null && !this.#hidden.has(index);
  }

  toggleStage(index: number): void {
    if (this.#data.stages[index] == null) return;
    if (this.#hidden.has(index)) this.#hidden.delete(index);
    else this.#hidden.add(index);
    this.#hoveredIndex = null;
    this.notifyListeners();
  }

  hoverStage(index: number): void {
    if (!this.isStageVisible(index) || this.#hoveredIndex === index) return;
    this.#hoveredIndex = index;
    this.notifyListeners();
  }

  unhoverStage(index: number): void {
    if (this.#hoveredIndex !== index) return;
    this.unhoverAllStages();
  }

  unhoverAllStages(): void {
    if (this.#hoveredIndex == null) return;
    this.#hoveredIndex = null;
    this.notifyListeners();
  }

  isStageHovered(index: number): boolean {
    return this.#hoveredIndex === index;
  }
}
